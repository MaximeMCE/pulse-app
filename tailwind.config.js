/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'bg-blue-200', 'text-blue-800',
    'bg-yellow-200', 'text-yellow-800',
    'bg-green-200', 'text-green-800',
    'bg-red-200', 'text-red-800',
    'bg-gray-200', 'text-gray-800',
    'bg-blue-100', 'text-blue-900',
    'bg-yellow-100', 'text-yellow-900',
    'bg-green-100', 'text-green-900',
    'bg-red-100', 'text-red-900',
    'bg-gray-100', 'text-gray-900',
    'bg-blue-500', 'text-blue-500',
    'bg-yellow-500', 'text-yellow-500',
    'bg-green-500', 'text-green-500',
    'bg-red-500', 'text-red-500',
    'bg-gray-500', 'text-gray-500',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
