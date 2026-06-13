/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf8e8',
          100: '#f9edbb',
          500: '#bf9b23',
          600: '#a6871e',
          700: '#8c7219',
        },
        // Light theme colors
        light: {
          bg: '#faf9f7',
          surface: '#f5f3f0',
          card: '#ffffff',
          text: '#2c2c2c',
          textMuted: '#6b6b6b',
          border: '#e5e3e0',
          accent: '#bf9b23',
        },
        // Dark theme colors (emerald green)
        dark: {
          bg: '#052A22',
          surface: '#0a3d30',
          card: '#0f4a39',
          text: '#f5f3f0',
          textMuted: '#a8b8b3',
          border: '#1a5c48',
          accent: '#bf9b23',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
