import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  // Setting base to '/assets/' to match the subfolder structure the TWA expects
  base: '/assets/',
  plugins: [
    react(),
    // This plugin copies root assets to the build subfolder
    viteStaticCopy({
      targets: [
        { src: 'sw.js', dest: '' },
        { src: 'manifest.json', dest: '' },
        { src: '*.png', dest: '' },
        { src: '*.pdf', dest: '' },
        // Assetlinks must remain at the domain root, not in the /assets/ subfolder
        { src: '.well-known', dest: '../.well-known' } 
      ]
    })
  ],
  define: {
    // Passes the environment variable to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});