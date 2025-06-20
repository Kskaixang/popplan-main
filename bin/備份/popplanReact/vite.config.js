import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/*
server: {
    port: 3000, // 將此處改為你想要的埠號
  },
*/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
})
