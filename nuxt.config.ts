export default defineNuxtConfig({
  // App
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Build
  builder: 'vite',
  nitro: {
    storage: {
      cache: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV',
      },
    },

    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        preview_urls: false,
        workers_dev: false,
        observability: {
          enabled: true,
          logs: {
            enabled: true,
            invocation_logs: true,
            head_sampling_rate: 1,
          },
          traces: {
            enabled: true,
            head_sampling_rate: 1,
          },
        },
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'banhmi-api',
            database_id: 'dcdd7345-d340-4db0-9980-e936c5d74254',
          },
        ],
        kv_namespaces: [
          {
            binding: 'KV',
            id: 'adf0da10bbd8457cb48486112673b991',
          },
        ],
        vars: {
          NUXT_SITE_URL: 'https://banhmi-api.rest',
        },
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
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxt/eslint',
    'evlog/nuxt',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
})
