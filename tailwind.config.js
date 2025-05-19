/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,tsx}', './index.html'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // 禁用 Tailwind 预设样式
  },
  plugins: [],
};
