import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Global settings for all target files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
  },
  
  // 2. Base Recommended JavaScript Rules
  js.configs.recommended,
  
  // 3. React Recommended & JSX Runtime (turns off react-in-jsx-scope)
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  
  // 4. Custom Overrides & Strict Rules (Must go last!)
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "semi": ["error", "always"],          // Enforces semicolons at the end of statements
      "no-unused-vars": "error",           // Throws error if data/variables are defined but unused
      "no-undef": "error"                  // Throws error for undeclared variables (missing data)
    }
  }
]);
