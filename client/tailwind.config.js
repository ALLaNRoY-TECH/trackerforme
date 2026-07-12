export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        darkCard: '#131c2e',
        accentPrimary: '#10b981', // Emerald green
        accentSecondary: '#6366f1', // Indigo blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
