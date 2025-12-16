import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // This plugin copies your root assets (pdf, icons, sw, manifest) to the build folder
    viteStaticCopy({
      targets: [
        { src: 'sw.js', dest: '' },
        { src: 'manifest.json', dest: '' },
        { src: '*.png', dest: '' },
        { src: '*.svg', dest: '' },
        { src: '*.pdf', dest: '' },
        // This is required for Android App Links verification
        { src: '.well-known', dest: '.well-known' } 
      ]
    })
  ],
  define: {
    // Passes the Vercel environment variable to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});