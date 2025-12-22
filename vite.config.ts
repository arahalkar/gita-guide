
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  // Resetting base to '/' is the standard for PWAs and TWAs.
  // This places index.html and manifest.json at the domain root.
  base: '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Copy critical PWA files to the dist root
        { src: 'sw.js', dest: '' },
        { src: 'manifest.json', dest: '' },
        { src: 'icon-192.png', dest: '' },
        { src: 'icon-512.png', dest: '' },
        { src: 'gita-hindi.pdf', dest: '' },
        
        // Target the specific file to avoid directory recursion errors in Vercel.
        // This will create dist/.well-known/assetlinks.json
        { 
          src: '.well-known/assetlinks.json', 
          dest: '.well-known'
        } 
      ]
    })
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
