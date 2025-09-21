/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apple-blue': '#007AFF',
        'apple-green': '#34C759',
        'apple-gray': '#8E8E93',
        'apple-surface': '#F5F5F7',
        'apple-border': '#E5E5E7',
        'apple-text': '#1D1D1F',
        'apple-text-secondary': '#86868B',
      },
      boxShadow: {
        'apple': '0 2px 16px rgba(0,0,0,0.1)',
        'apple-hover': '0 4px 24px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}