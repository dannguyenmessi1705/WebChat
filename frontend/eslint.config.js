import globals from "globals";
import pluginJs from "@eslint/js"; // Thư viện eslint cho JavaScript
import tseslint from "typescript-eslint"; // Thư viện eslint cho TypeScript
import pluginReact from "eslint-plugin-react"; // Thư viện eslint cho React
import hooksPlugin from "eslint-plugin-react-hooks"; // Thư viện eslint cho React Hooks (eslint-plugin-react-hooks)
import tailwind from "eslint-plugin-tailwindcss"; // Thư viện eslint cho Tailwind CSS
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"; // Thư viện eslint cho Prettier
import eslintConfigPrettier from "eslint-config-prettier"; // Thư viện eslint cho Prettier

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] }, // Check tất cả các file có đuôi này
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      "react-hooks": hooksPlugin, // Sử dụng eslint-plugin-react-hooks (eslint-plugin-react-hooks)
    },
    rules: hooksPlugin.configs.recommended.rules, // Sử dụng cấu hình mặc định của eslint-plugin-react-hooks
  },
  {
    plugins: {
      pluginReact: pluginReact.configs.flat.recommended, // Sử dụng eslint-plugin-react (eslint-plugin-react)
    },
    rules: {
      "pluginReact/configs/recommended/rules/react/prop-types": "off", // Tắt kiểm tra prop-types (Dấu `,` ở cuối)
      "pluginReact/configs/recommended/rules/react/react-in-jsx-scope": "off", // Tắt kiểm tra React JSX scope
      "pluginReact/configs/recommended/rules/react/jsx-uses-react": "off", // Tắt kiểm tra JSX uses React
    },
  },
  // PLUGIN
  pluginJs.configs.recommended, // Sử dụng cấu hình mặc định của eslint-plugin-js
  ...tseslint.configs.recommended, // Sử dụng cấu hình mặc định của eslint-plugin-typescript
  eslintConfigPrettier, // Sử dụng cấu hình mặc định của eslint-config-prettier
  eslintPluginPrettier, // Sử dụng cấu hình mặc định của eslint-plugin-prettier
  ...tailwind.configs["flat/recommended"], // Sử dụng cấu hình mặc định của eslint-plugin-tailwindcss
];
