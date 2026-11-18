import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createClient } from 'contentful';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

const space = process.env.CONTENTFUL_SPACE_ID?.trim();
const publicToken = process.env.CONTENTFUL_PUBLIC_TOKEN?.trim();
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN?.trim();
const region = process.env.CONTENTFUL_REGION?.trim().toLowerCase() || 'us';

const missingVariables = [
  !space && 'CONTENTFUL_SPACE_ID',
  !publicToken && 'CONTENTFUL_PUBLIC_TOKEN',
  !previewToken && 'CONTENTFUL_PREVIEW_TOKEN',
].filter(Boolean);

if (missingVariables.length > 0) {
  console.error(`Faltan variables de Contentful: ${missingVariables.join(', ')}.`);
  process.exitCode = 1;
} else if (region !== 'us' && region !== 'eu') {
  console.error('CONTENTFUL_REGION debe ser "us" o "eu".');
  process.exitCode = 1;
} else {
  const checks = [
    {
      label: 'contenido publicado',
      accessToken: publicToken,
      host: region === 'eu' ? 'cdn.eu.contentful.com' : 'cdn.contentful.com',
    },
    {
      label: 'vista previa',
      accessToken: previewToken,
      host: region === 'eu' ? 'preview.eu.contentful.com' : 'preview.contentful.com',
    },
  ];

  for (const { label, accessToken, host } of checks) {
    try {
      const client = createClient({ space, accessToken, host });
      const response = await client.getEntries({ limit: 1 });
      const contentStatus = response.total > 0 ? 'hay entradas disponibles' : 'no hay entradas disponibles';
      console.log(`Conexión de ${label} correcta: ${contentStatus}.`);
    } catch (error) {
      const status = typeof error?.status === 'number' ? ` (HTTP ${error.status})` : '';
      console.error(`No se pudo consultar ${label}${status}. Comprueba el espacio, token, región y conexión.`);
      process.exitCode = 1;
    }
  }
}
