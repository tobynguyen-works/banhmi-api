export default defineNuxtConfig({
  // App
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Build
  builder: 'vite',
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        preview_urls: false,
        workers_dev: false,
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'banhmi-api',
            database_id: 'dcdd7345-d340-4db0-9980-e936c5d74254',
          },
        ],
      },
    },
  },

  // Runtime
  runtimeConfig: {
    siteUrl: 'http://localhost:3000',
  },

  // Content
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },

  // Modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/scripts',
    '@nuxt/hints',
    'evlog/nuxt',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
})
