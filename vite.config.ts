import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const contentfulConfig = {
    space: env.CONTENTFUL_SPACE_ID,
    accessToken: env.CONTENTFUL_PUBLIC_TOKEN,
    region: env.CONTENTFUL_REGION || 'us',
  }

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
