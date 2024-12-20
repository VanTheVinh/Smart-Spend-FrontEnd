/* eslint-disable react-hooks/rules-of-hooks */
const { override, useBabelRc } = require("customize-cra");

module.exports = override(
  // Sử dụng cấu hình Babel từ tệp .babelrc
  useBabelRc()
);
