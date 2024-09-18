import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { name } from "./package.json"

const genBaseUrl = (mode: string) => {
  if (mode == "production") {
    return `/${name}/`
  } else if (mode == "test") {
    return `/${name}/`
  }
  return "/"
}


export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    base: genBaseUrl(mode),
    plugins: [
      react()
    ],
    build: {
      rollupOptions: {
        output: {
          // 自定义输出目录结构
          assetFileNames: '[name][extname]', // 将所有资源放在根目录
          chunkFileNames: '[name].js', // 将所有 chunk 文件放在根目录
          entryFileNames: '[name].js', // 将所有入口文件放在根目录
        }
      }
    }
  }
})
