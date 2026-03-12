import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用相对路径，配合 HashRouter，可直接部署到 GitHub Pages 项目页。
  base: './'
});
