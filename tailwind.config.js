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
        solibrarium: "var(--solibrarium-color)",
        shadcn_input: "hsl(var(--shadcn-input-hsl))",
        shadcn_ring: "hsl(var(--shadcn-ring-hsl))",
      },
      backgroundImage: {
        "theme-switch-on": "var(--theme-switch-on)",
        "theme-switch-off": "var(--theme-switch-off)",
        "theme-switch-thumb-on": "var(--theme-switch-thumb-on)",
        "theme-switch-thumb-off": "var(--theme-switch-thumb-off)",
      },
      backgroundSize: {
        "theme-switch-on": "44px, 20px",
        "theme-switch-off": "44px, 20px",
        "theme-switch-thumb-on": "16px",
        "theme-switch-thumb-off": "16px",
      },
      backgroundPosition: {
        "theme-switch-on": "center",
        "theme-switch-off": "center",
      },
      dropShadow: {
        "sunny": "5px 5px 0px rgba(0, 0, 0, 0.75)",
        "luna": "5px 5px 2px rgba(0, 191, 255, 0.5)",
        "star": "var(--header-dropshadow)"
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tw-elements-react/dist/plugin.cjs")],
}