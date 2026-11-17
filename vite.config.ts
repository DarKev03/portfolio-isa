import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.CONTENTFUL_ENABLED && !['true', 'false'].includes(env.CONTENTFUL_ENABLED)) {
    throw new Error('CONTENTFUL_ENABLED debe ser "true" o "false".')
  }
  const contentfulConfig = env.CONTENTFUL_ENABLED === 'true'
    ? {
        space: env.CONTENTFUL_SPACE_ID,
        accessToken: env.CONTENTFUL_PUBLIC_TOKEN,
        region: env.CONTENTFUL_REGION || 'us',
      }
    : null

  return {
    define: {
      __CONTENTFUL_CONFIG__: JSON.stringify(contentfulConfig),
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      allowedHosts: true,
    },
  }
})
