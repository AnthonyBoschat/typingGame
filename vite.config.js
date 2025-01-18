import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{

      "@src":path.resolve(__dirname, "./src"),
      "@Components":path.resolve(__dirname, "./src/Components"),
      "@Containers":path.resolve(__dirname, "./src/Containers"),
      "@Layout":path.resolve(__dirname, "./src/Layout"),
      "@Pages":path.resolve(__dirname, "./src/Pages"),

      "@Constants":path.resolve(__dirname, "./src/Physics/Constants"),
      "@Query":path.resolve(__dirname, "./src/Physics/GraphQL/Query"),
      "@Mutation":path.resolve(__dirname, "./src/Physics/GraphQL/Mutation"),
      "@Redux":path.resolve(__dirname, "./src/Physics/Redux"),
      "@Sass":path.resolve(__dirname, "./src/Physics/Sass"),
      "@Services":path.resolve(__dirname, "./src/Physics/Services"),

    }
  }
})
