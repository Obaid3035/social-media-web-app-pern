module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: ["eslint:recommended", "google"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "require-jsdoc": 0,
    "new-cap": 0,
    "no-multiple-empty-lines": 0,
    "no-undef": 0,
    "no-console": 0,
    camelcase: 0,
    quotes: 0,
    "object-curly-spacing": 0,
    indent: 0,
    "no-unused-vars": 0,
  },
};
