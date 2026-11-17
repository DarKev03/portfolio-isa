import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, resolveConfig } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { parseProject, getContentImages } = await server.ssrLoadModule('/src/contentful/projects.ts');
const { parseCv } = await server.ssrLoadModule('/src/contentful/cv.ts');

test('configura Contentful aunque el antiguo interruptor esté desactivado', async () => {
  const keys = ['CONTENTFUL_ENABLED', 'CONTENTFUL_SPACE_ID', 'CONTENTFUL_PUBLIC_TOKEN', 'CONTENTFUL_PREVIEW_TOKEN', 'CONTENTFUL_REGION'];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  Object.assign(process.env, {
    CONTENTFUL_ENABLED: 'false',
    CONTENTFUL_SPACE_ID: 'test-space',
    CONTENTFUL_PUBLIC_TOKEN: 'test-public',
    CONTENTFUL_PREVIEW_TOKEN: 'test-preview',
    CONTENTFUL_REGION: 'eu',
  });
  try {
    const config = await resolveConfig({}, 'serve');
    assert.deepEqual(JSON.parse(config.define.__CONTENTFUL_CONFIG__), {
      space: 'test-space',
      accessToken: 'test-public',
      region: 'eu',
    });
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

function cvEntry() {
  const asset = name => ({
    fields: {
      file: { es: { url: `//assets.ctfassets.net/space/${name}.pdf`, contentType: 'application/pdf' } },
    },
  });
  return { fields: { cv: { es: asset('espanol'), en: asset('ingles') } } };
}

test('elige el CV vinculado al idioma sin sustituir una traducción ausente', () => {
  const cv = cvEntry();
  assert.equal(parseCv(cv, 'es'), 'https://assets.ctfassets.net/space/espanol.pdf');
  assert.equal(parseCv(cv, 'en'), 'https://assets.ctfassets.net/space/ingles.pdf');
  delete cv.fields.cv.en;
  assert.throws(() => parseCv(cv, 'en'), /PDF válido para este idioma/);
});

test('rechaza archivos no PDF, sin resolver o con origen no permitido', () => {
  const cv = cvEntry();
  cv.fields.cv.es.fields.file.es.contentType = 'image/png';
  assert.throws(() => parseCv(cv, 'es'), /PDF válido/);
  cv.fields.cv.es = { sys: { id: 'sin-resolver' } };
  assert.throws(() => parseCv(cv, 'es'), /PDF válido/);
  cv.fields.cv.es = { fields: { file: { es: { url: 'https://example.com/cv.pdf', contentType: 'application/pdf' } } } };
  assert.throws(() => parseCv(cv, 'es'), /origen no permitido/);
});

test('valida solo el archivo seleccionado de un recurso localizado', () => {
  const cv = cvEntry();
  cv.fields.cv.es.fields.file.en = { url: '//assets.ctfassets.net/space/otro.png', contentType: 'image/png' };
  assert.equal(parseCv(cv, 'es'), 'https://assets.ctfassets.net/space/espanol.pdf');
  cv.fields.cv.en = cv.fields.cv.es;
  assert.throws(() => parseCv(cv, 'en'), /PDF válido/);
});

function entry() {
  const asset = {
    fields: {
      title: 'Imagen',
      file: { url: '//images.ctfassets.net/space/image.jpg' },
    },
  };
  return {
    sys: { id: 'project-id' },
    fields: {
      titulo: 'Proyecto',
      categorias: ['Diseño'],
      fechaPublicacin: '2024-01-01T00:00:00+01:00',
      portada: asset,
      textoProyecto: {
        nodeType: 'document',
        data: {},
        content: [
          { nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Texto', marks: [], data: {} }] },
          { nodeType: 'embedded-asset-block', data: { target: asset }, content: [] },
        ],
      },
    },
  };
}

test('admite contenido válido, conserva el año y extrae imágenes', () => {
  const project = parseProject(entry());
  assert.equal(project.id, 'project-id');
  assert.equal(project.year, 2024);
  assert.deepEqual(getContentImages(project.richContent, project.title), [project.image]);
});

test('rechaza campos obligatorios incompletos', () => {
  const invalid = entry();
  invalid.fields.titulo = '';
  assert.throws(() => parseProject(invalid), error => {
    assert.match(error.message, /campos incompletos o inválidos: fields\.titulo/);
    assert.match(error.forLanguage('en'), /missing or invalid fields: fields\.titulo/);
    return true;
  });
});

test('admite categorías y fecha opcionales sin ocultar valores inválidos', () => {
  const project = entry();
  delete project.fields.categorias;
  delete project.fields.fechaPublicacin;
  const parsed = parseProject(project);
  assert.deepEqual(parsed.tags, []);
  assert.equal(parsed.year, undefined);

  project.fields.categorias = [''];
  assert.throws(() => parseProject(project), /fields\.categorias/);
  project.fields.categorias = [];
  project.fields.fechaPublicacin = 'fecha inválida';
  assert.throws(() => parseProject(project), /fields\.fechaPublicacin/);
});

test('rechaza imágenes sin resolver o con origen no permitido', () => {
  const invalid = entry();
  invalid.fields.portada = { sys: { id: 'missing' } };
  assert.throws(() => parseProject(invalid), /no está disponible/);
  invalid.fields.portada = { fields: { file: { url: 'https://example.com/image.jpg' } } };
  assert.throws(() => parseProject(invalid), /origen no permitido/);
});

test('rechaza texto mal formado y enlaces peligrosos', () => {
  const invalid = entry();
  invalid.fields.textoProyecto.content = [{ nodeType: 'text', value: 'Texto', marks: [], data: {} }];
  assert.throws(() => parseProject(invalid), /texto enriquecido/);
  invalid.fields.textoProyecto.content = [{
    nodeType: 'paragraph',
    data: {},
    content: [{
      nodeType: 'hyperlink',
      data: { uri: 'javascript:alert(1)' },
      content: [{ nodeType: 'text', value: 'Enlace', marks: [], data: {} }],
    }],
  }];
  assert.throws(() => parseProject(invalid), /enlace no permitido/);
});
