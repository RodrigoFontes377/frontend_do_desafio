/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0f1115',
          800: '#1a1d23',
          700: '#2a2f3a',
          600: '#404653',
          400: '#9096a2',
          300: '#ced3dc',
          200: '#e2e5eb',
          100: '#f3f4f7',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        blue: {
          400: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
}