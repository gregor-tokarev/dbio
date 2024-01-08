/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        dark: "#060606",
        "gray-500": "#808080",
        "gray-400": "#4D4D4D",
        "gray-300": "#A1A1A1",
        "gray-200": "#BDBDBD",
        "gray-100": "#E8E8E8",
        accent: "#EE1100",
        "accent-dark": "#B20A0A",
        white: "#FFFFFF",
        "white-hover": "#FAFAFA",
      },
    },
  },
  plugins: [],
  safelist: ["z-50", "text-accent"],
};
