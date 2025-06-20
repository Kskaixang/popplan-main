import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/*
server: {
    port: 3000, // 將此處改為你想要的埠號
  },
*/
// https://vitejs.dev/config/
export default defineConfig({
  //同網域分享 代理置換

  // server: {
  //   host: '10.100.53.3', // 讓區網可連
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       // ✅ 切換 target：localhost 或區網 IP
  //       target: 'http://localhost:8080', // ← 或改成 'http://10.100.53.3:8080'
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  //使用方式
  // const EventURL = 'http://localhost:8080/event';
  //const EventURL = 'api/event';



  plugins: [react()],


  define: {
    global: 'window', // 為了讓 STOMP.js 可以正常使用 global
  },
})
