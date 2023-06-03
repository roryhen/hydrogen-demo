/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  ...require('@shopify/prettier-config'),
};
