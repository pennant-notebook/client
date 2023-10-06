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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-family': ['react', 'react-dom', 'react-query', 'react-router-dom', 'react-dnd', 'react-dnd-html5-backend'],
          'mui': ['@mui/material', '@mui/icons-material', '@mui/x-tree-view'],
          'codemirror': [
            '@codemirror/autocomplete',
            '@codemirror/commands',
            '@codemirror/lang-javascript',
            '@codemirror/lang-python',
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/theme-one-dark',
            '@uiw/codemirror-theme-dracula',
            '@uiw/codemirror-theme-tokyo-night',
            '@uiw/codemirror-theme-vscode'
          ],
          'blocknote': ['@blocknote/core', '@blocknote/react'],
          'yjs': ['y-codemirror.next', 'y-indexeddb', 'yjs'],
          'others': ['axios', 'jwt-decode', 'recoil', 'uuid']
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src/types')
    }
  }
});