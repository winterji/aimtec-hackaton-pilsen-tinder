/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#754425",
          green: "#2F6E22",
          cream: "#E0DAD8",
          blue: "#276FBF",
          orange: "#EF8A17",
        }
      },
      animation: {
        'gradient-pulse': 'gradient-pulse 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-pulse': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      }
    },
  },
  plugins: [],
}
