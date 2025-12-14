/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-instagram': 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040, #FFDC80)',
        'gradient-pink-purple': 'linear-gradient(to right, #ec4899, #8b5cf6)',
        'gradient-blue-purple': 'linear-gradient(to right, #3b82f6, #8b5cf6)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'instagram': {
          'pink': '#ec4899',
          'purple': '#8b5cf6',
          'blue': '#3b82f6',
          'red': '#ef4444',
          'orange': '#f97316',
        }
      },
      boxShadow: {
        'instagram': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'instagram-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'instagram-xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'instagram': '1rem',
        'instagram-lg': '1.5rem',
        'instagram-xl': '2rem',
      }
    },
  },
  plugins: [],
}