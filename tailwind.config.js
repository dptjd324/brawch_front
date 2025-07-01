/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NougatExtraBlack', 'sans-serif'], // 기본 sans를 덮어쓰기
        nougat: ['NougatExtraBlack', 'sans-serif'], // 별도로도 사용 가능
      },
    },
  },

  plugins: [],
};
