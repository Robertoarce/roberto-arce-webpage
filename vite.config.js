import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/",
  optimizeDeps: {
    include: ['@xenova/transformers']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks for better caching
          'vendor-vue': ['vue'],
          'vendor-router': ['vue-router'],
          // Keep art components together as they might be loaded together
          'art-components': [
            './src/components/00_Art/Cube.vue',
            './src/components/00_Art/galaxy.vue',
            './src/components/00_Art/Network.vue',
            './src/components/00_Art/Coliders.vue'
          ],
          // Keep professional components together
          'profession-components': [
            './src/components/01_Profession/StartPage.vue',
            './src/components/01_Profession/TimeLine.vue',
            './src/components/01_Profession/Portfolio.vue',
            './src/components/01_Profession/Diplomas.vue'
          ]
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable compression and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/assets/diplomas'),
      '@ds': path.resolve(__dirname, 'src/assets/screenshots'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      
    },
  },
 


});