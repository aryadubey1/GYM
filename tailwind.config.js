/** FitForge: Tailwind is compiled into static/css/app.css (run bin/build-css.sh after template changes). */
module.exports = {
  content: ["./templates/**/*.html", "./core/**/*.py", "./static/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: { 0: "#0a0a0b", 1: "#121214", 2: "#1a1a1d", 3: "#26262a" },
        bone: { DEFAULT: "#f4f2ee", 2: "#d6d3ce", 3: "#a19d97", 4: "#7d7974" },
        ember: { DEFAULT: "#e11d48", hover: "#f43f5e", soft: "#fb7185", deep: "#9f1239" },
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: "20px" },
      transitionTimingFunction: {
        expo: "cubic-bezier(.16,1,.3,1)",
        quart: "cubic-bezier(.165,.84,.44,1)",
        wipe: "cubic-bezier(.76,0,.24,1)",
      },
    },
  },
  plugins: [],
};
