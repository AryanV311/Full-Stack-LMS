/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "text-course-details-heading-small",
    "text-course-details-heading-large",
    "text-home-heading-small",
    "text-home-heading-large",
    "text-default",
  ],
  theme: {
    extend: {
      fontSize: {
        "course-details-heading-small": ["26px", "36px"],
        "course-details-heading-large": ["36px", "44px"],
        "home-heading-small": ["28px", "34px"],
        "home-heading-large": ["48px", "56px"],
        default: ["15px", "21px"],
      },
      gridTemplateColum: {
        auto: "repeat(auto-fit, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
