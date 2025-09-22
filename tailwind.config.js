/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // 시뮬레이터 테마 색상
        simulator: {
          vacuum: '#1976d2',
          cleaning: '#4caf50',
          oxidation: '#ff5722',
          lithography: '#9c27b0',
          etching: '#607d8b',
          deposition: '#795548',
          implantation: '#3f51b5',
          inspection: '#009688',
          packaging: '#ff9800'
        },
        // 진공도 색상
        pressure: {
          atmospheric: '#ffcdd2',
          low: '#fff3e0',
          medium: '#e8f5e8',
          high: '#e3f2fd',
          ultra: '#f3e5f5'
        }
      },
      fontFamily: {
        'mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      screens: {
        '3xl': '1792px',
      }
    },
  },
  plugins: [
    // Form styles
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Typography
    require('@tailwindcss/typography'),
    // Custom plugin for simulator themes
    function({ addUtilities, theme }) {
      const simulatorUtilities = {
        '.simulator-card': {
          '@apply bg-white rounded-lg border shadow-sm p-6 transition-all hover:shadow-md': {},
        },
        '.simulator-tab': {
          '@apply px-4 py-2 rounded-lg font-medium text-sm transition-colors': {},
        },
        '.simulator-tab-active': {
          '@apply bg-blue-500 text-white shadow-md': {},
        },
        '.simulator-tab-inactive': {
          '@apply text-gray-600 hover:text-gray-800 hover:bg-gray-100': {},
        },
        '.pressure-indicator': {
          '@apply inline-block w-3 h-3 rounded-full mr-2': {},
        },
        '.animation-molecule': {
          '@apply animate-pulse opacity-70': {},
        }
      }
      addUtilities(simulatorUtilities)
    }
  ],
  // Dark mode support (미래 확장용)
  darkMode: 'class',
}
