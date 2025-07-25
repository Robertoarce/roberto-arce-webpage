import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/showcase-webpage/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/assets/diplomas'),
      '@ds': path.resolve(__dirname, 'src/assets/screenshots'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      
    },
  },
 


});