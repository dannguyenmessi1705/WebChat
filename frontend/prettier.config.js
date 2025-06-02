/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5", // Dấu phẩy ở cuối dòng (none, es5, all)
  endOfLine: "auto", // Kết thúc dòng (auto, lf, crlf, cr)
  semi: true, // Dấu chấm phẩy
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
