export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0F0F0F',
          800: '#1A1A1A',
          700: '#242424',
          600: '#2E2E2E',
          500: '#3A3A3A',
        },
        primary: {
          500: '#00D4AA',
          600: '#00B894',
          700: '#009C7F',
        },
        accent: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
