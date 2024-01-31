import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import Fonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    react(),
    Fonts({
      google: {
        families: ['Lato', 'Inter', 'Fira Code']
      }
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src/types')
    }
  },
  assetsInclude: ['**/*.mp4', '**/*.md'],
});