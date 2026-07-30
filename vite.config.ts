import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 禁用 modulepreload polyfill，避免在小红书离线环境中使用 fetch
    modulePreload: {
      polyfill: false,
    },
    // 内联所有小于 10KB 的资源，减少外部请求
    assetsInlineLimit: 10240,
    // 关闭代码分割，所有代码打包到一个 JS 文件
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
