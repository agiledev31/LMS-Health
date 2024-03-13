/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        primary: {
          50: "#F9F5FF",
          100: "#F4EBFF",
          200: "#E9D7FE",
          300: "#D6BBFB",
          400: "#B692F6",
          500: "#9E77ED",
          600: "#7F56D9",
          700: "#6941C6",
          800: "#53389E",
        },
        red: {
          bg: "#F3E9F0",
          light: "#B9146F",
          dark: "#B9146F",
        },
        green: {
          bg: "#E3F3E9",
          light: "#4FFF75",
          dark: "#3D916D",
        },
        grayBlue: {
          50: "#F8F9FC",
          200: "#D5D9EB",
          700: "#363F72",
        },
        orange: {
          50: "#FEF6EE",
          200: "#F9DBAF",
          700: "#B93815",
          bg: "#FFFAEB",
          light: "#FE9C28",
          dark: "#B54708",
        },
        gray: {
          50: "#F9FAFB",
          200: "#EAECF0",
          300: "#D0D5DD",
          600: "#475467",
          700: "#344054",
          800: "#1f2937",
          bg: "#F1F1F1",
          dark: "#9EA1A6",
        },
        blue: {
          50: "#EFF8FF",
          200: "#B2DDFF",
          700: "#175CD3",
          light: "#4478FF",
        },
        indigo: {
          50: "#EEF4FF",
          200: "#C7D7FE",
          700: "#3538CD",
        },
        pink: {
          50: "#FDF2FA",
          200: "#FCCEEE",
          700: "#C11574",
        },
        success: {
          50: "#ECFDF3",
          200: "#ABEFC6",
          700: "#067647",
        },
        lightBlue: {
          50: "#F0F9FF",
          200: "#B9E6FE",
          700: "#026AA2",
        },
        purple: {
          50: "#F4F3FF",
          200: "#D9D6FE",
          700: "#5925DC",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
