import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
