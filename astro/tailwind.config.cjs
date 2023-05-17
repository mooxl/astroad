/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      plex: ["Plex", "sans-serif"],
    },
    extend: {
      colors: {
        gray: {
          DEFAULT: "#111111",
          light: "#888888",
          dark: "#222222",
        },
      },
    },
  },
  safelist: [],
  plugins: [],
};
