/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'geocasa-blue': '#01479f',
        'geocasa-orange': '#ff8201',
        'geocasa-blue-light': '#0159bf',
        'geocasa-blue-dark': '#013a7f',
        'geocasa-orange-light': '#ff9221',
        'geocasa-orange-dark': '#e07401',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
