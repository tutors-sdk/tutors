const eslintConfig = require("tutors-configs/eslintConfig");

const config = {
  ...eslintConfig,
  parserOptions: {
    ...eslintConfig.parserOptions,
    tsconfigRootDir: __dirname,
  },
};
//test
module.exports = config;
