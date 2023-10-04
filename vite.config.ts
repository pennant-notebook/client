import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts'

export default defineConfig({
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: ['Lato']
      }
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src/types')
    }
  }
});