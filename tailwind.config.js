/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      extend: {
        colors: {
          softWhite: '#faf9f7',
          dustyRose: '#f4c7c3',
          sageGreen: '#8fbf9f',
          deepTeal: '#2f5d5d',
          charcoal: '#3a3a3a',
          metallicGold: '#d4af37',
          metallicGoldLight: '#ffd700'
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          serif: ['Playfair Display', 'serif']
        },
        boxShadow: {
          glow: '0 0 20px rgba(212, 175, 55, 0.5)',
          pulse: '0 0 10px rgba(244, 199, 195, 0.7) inset'
        },
        animation: {
          float: 'float 4s ease-in-out infinite',
          'pulse-slow': 'pulse 3s ease-in-out infinite'
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' }
        },
      borderRadius: {
        xl: '1rem',
        sacred: '2rem'
      },
      fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }
        },
  plugins: [],
}