/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    // Base color classes
    {
      pattern: /^(bg|text|border)-(red|blue|green|gray)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Hover variants must be defined separately
    {
      pattern: /^hover:bg-(red|blue|green|gray)-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: [],
    },
    // Specific non-color classes
    'cursor-not-allowed',
    'w-20',
    'h-20',
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
