const eslintConfig = require("tutors-configs/eslintConfig");

const config = {
  ...eslintConfig,
  parserOptions: {
    ...eslintConfig.parserOptions,
    tsconfigRootDir: __dirname,
  },
};

module.exports = config;
