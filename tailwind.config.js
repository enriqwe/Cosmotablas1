/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0e27',
        'space-navy': '#1a2332',
        'space-blue': '#2563eb',
        'success': '#10b981',
        'warning': '#f59e0b',
        'gold': '#fbbf24',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
