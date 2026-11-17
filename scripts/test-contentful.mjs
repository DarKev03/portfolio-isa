import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { parseProject, getContentImages } = await server.ssrLoadModule('/src/contentful/projects.ts');

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
  assert.throws(() => parseProject(invalid), /campos incompletos o inválidos/);
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
