/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0089FF",
        "balck-text": "#0C1C33",
        "sub-text": "#8E9AB0",
        "gap-text": "#E8EAEF",
        "error-text": "#FF381F",
      },
      padding: {
        1.5: "0.375rem",
        2.5: "0.625rem",
        3.5: "0.875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      margin: {
        2.5: "0.625rem",
        3.5: "0.875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      width: {
        10.5: "2.625rem",
      },
      height: {
        10.5: "2.625rem",
      },
    },
  },
  corePlugins: {
    // preflight: false
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
