/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
            theme: {
              extend: {
                fontFamily: {
                  serif: ['Playfair Display', 'serif'],
                  sans: ['Inter', 'sans-serif'],
                },
                colors: {
                  softWhite: '#faf9f7',
                  dustyRose: '#f4c7c3',
                  sageGreen: '#8fbf9f',
                  deepTeal: '#2f5d5d',
                  charcoal: '#3a3a3a',
                  metallicGold: '#d4af37',
                  metallicGoldLight: '#ffd700',
                },
                boxShadow: {
                  glow: '0 0 20px rgba(212,175,55,0.5)',
                  pulse: '0 0 10px rgba(244,199,195,0.7) inset',
                },
                animation: {
                  float: 'float 4s ease-in-out infinite',
                  fadeIn: 'fadeIn 0.6s ease-out',
                },
                keyframes: {
                  float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                  },
                  fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(6px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                },
                borderRadius: {
                  xl: '1rem',
                  sacred: '2rem',
                },
              },
            },  plugins: [
              require('@tailwindcss/typography'),
              require('@tailwindcss/forms'),
              require('@tailwindcss/aspect-ratio'),
              require('@tailwindcss/line-clamp'),
            ]