/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,tsx}', 
    './components/**/*.{js,jsx,tsx}',
    './src/pages/**/*.{js,jsx,tsx,mdx}',  // If you have files in src
    './src/components/**/*.{js,jsx,tsx,mdx}',  // If you have components in src
    './src/app/**/*.{js,jsx,tsx,mdx}',  // If you have app directory in src
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
