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
        { src: '*.svg', dest: '' },
        { src: '*.pdf', dest: '' },
        // This copies the .well-known folder for Android verification.
        // We ensure a placeholder exists so the build doesn't fail if you haven't added the real key yet.
        { src: '.well-known', dest: '.well-known' } 
      ]
    })
  ],
  define: {
    // Passes the Vercel environment variable to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});