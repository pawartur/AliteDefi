module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy": "#272D73",
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        "dmsans": ['DM Sans', 'sans-serif'],
        "novesquare": ['Nova Square', 'sans-serif'],
        "actor": ['Actor', 'sans-serif']
      }
    },
  },
  plugins: [],
}