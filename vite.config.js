import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // root: 'src', // 削除：ルートディレクトリをプロジェクトルートにする
  build: {
    outDir: 'dist', // 標準的な出力先
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
