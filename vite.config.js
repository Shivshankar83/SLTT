import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  darkMode: 'class',
  plugins: [
    tailwindcss(),
  ],
  define: {
    global: 'window'  // This will make `global` behave like `window` in the browser.
  }
  
})

