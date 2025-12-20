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
        { src: 'icon-192.png', dest: '' },
        { src: 'icon-512.png', dest: '' },
        { src: '*.pdf', dest: '' },
        // We target the file specifically and place it relative to the dist root
        // Since base is /assets/, 'dist' is one level up from the assets folder
        { 
          src: '.well-known/assetlinks.json', 
          dest: '../.well-known' 
        } 
      ]
    })
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});