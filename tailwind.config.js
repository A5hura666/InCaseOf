/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs,twig}"],
  theme: {
    extend: {
        gridAutoRows: {
            'locker': '100px',
        }
    },
  },
  plugins: [],
}

