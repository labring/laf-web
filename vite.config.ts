/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// const port = 9527 // dev port

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      dirs: [
        { dir: path.resolve(__dirname, './src/pages'), baseRoute: '' },
        { dir: path.resolve(__dirname, './src/pages/account'), baseRoute: '' },
      ],
      exclude: ['**/components/**.vue'],
      // extensions: ['.vue', '.js', '.ts'],
      // extendRoute(route: any) {
      //   if (route.name === 'about')
      //     route.props = (route: any) => ({ query: route.query.q })

      //   if (route.name === 'components') {
      //     return {
      //       ...route,
      //       beforeEnter: (route: any) => {
      //         // eslint-disable-next-line no-console
      //         console.log(route)
      //       },
      //     }
      //   }
      // },
    }),

    Layouts({
      layoutsDirs: path.resolve(__dirname, './src/layout'),
      defaultLayout: 'default',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },

  // server
  server: {
    // port,
    proxy: {
      '/sys-api': {
        target: 'http://console.local-dev.host:8080/',
        changeOrigin: true,
      },
      '/sys-extension-api': {
        target: 'http://console.local-dev.host:8080/',
        changeOrigin: true,
      },
    },
  },
})
