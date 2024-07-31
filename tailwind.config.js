/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "[class='dark-mode']"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './node_modules/tw-elements-react/dist/js/**/*.js',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        shadcn_input: "hsl(var(--shadcn-input-hsl))",
        shadcn_ring: "hsl(var(--shadcn-ring-hsl))",
        solibrarium: "var(--solibrarium-color)",
        "solibrarium-accent": "var(--solibrarium-accent-color)",
        green: "var(--green-color)",
        lightgreen: "var(--green-hover-color)",
        amaranth: "var(--red-color)",
        lightred: "var(--red-hover-color)",
        sunny: "rgb(0 0 0 / 0.75)",
        luna: "rgb(0 191 255 / 0.5)",
        star: "var(--header-dropshadow-color)"
      },
      backgroundImage: {
        "theme-switch-on": "var(--theme-switch-on)",
        "theme-switch-off": "var(--theme-switch-off)",
        "theme-switch-thumb-on": "var(--theme-switch-thumb-on)",
        "theme-switch-thumb-off": "var(--theme-switch-thumb-off)",
      },
      backgroundSize: {
        "theme-switch-on": "var(--theme-switch-size)",
        "theme-switch-off": "var(--theme-switch-size)",
        "theme-switch-thumb-on": "var(--theme-switch-thumb-size)",
        "theme-switch-thumb-off": "var(--theme-switch-thumb-size)",
      },
      backgroundPosition: {
        "theme-switch-on": "center",
        "theme-switch-off": "center",
      },
      dropShadow: {
        sunny: "5px 5px 0px rgb(0 0 0 / 0.75)",
        luna: "5px 5px 2px rgb(0 191 255 / 0.5)",
        star: "var(--header-dropshadow)"
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tw-elements-react/dist/plugin.cjs")],
}