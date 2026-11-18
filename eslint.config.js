import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { curly: ["error", "all"] } },
  {
    files: ["tools/*.mjs"],
    languageOptions: {
      globals: Object.fromEntries(
        [
          "fetch",
          "WebSocket",
          "process",
          "Buffer",
          "console",
          "setTimeout",
        ].map((name) => [name, "readonly"]),
      ),
    },
  },
);
