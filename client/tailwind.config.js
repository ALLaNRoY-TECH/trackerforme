export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: 'var(--bg-color)',
        darkCard: 'var(--card-bg)',
        emerald: {
          300: 'rgb(var(--accent-emerald-300) / <alpha-value>)',
          400: 'rgb(var(--accent-emerald-400) / <alpha-value>)',
          500: 'rgb(var(--accent-emerald-500) / <alpha-value>)',
          600: 'rgb(var(--accent-emerald-600) / <alpha-value>)',
        },
        indigo: {
          300: 'rgb(var(--accent-indigo-300) / <alpha-value>)',
          400: 'rgb(var(--accent-indigo-400) / <alpha-value>)',
          500: 'rgb(var(--accent-indigo-500) / <alpha-value>)',
          600: 'rgb(var(--accent-indigo-600) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
