/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fwc-bg': '#0a0a0f',
        'fwc-card': '#15151f',
        'fwc-border': '#2a2a3a',
        'fwc-gold': '#d4af37',
        'fwc-neon': '#00f0ff',
        'fwc-accent': '#ff3366',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
