import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/media/**', '**/video-extend/**', '**/*.mp4', '**/*.mov', '**/*.webm', '**/*.mkv'],
    },
  },
  build: {
    target: 'es2022',
  },
});
