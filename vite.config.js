import { defineConfig } from 'vite';

// base './' giúp đường dẫn tương đối hoạt động cả ở gốc domain (Netlify)
// lẫn trong thư mục con (GitHub Pages: https://<user>.github.io/<repo>/)
export default defineConfig({
  base: './',
});
