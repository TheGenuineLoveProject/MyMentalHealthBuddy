import reactHooks from "eslint-plugin-react-hooks";
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
  ignores: [
    "docs/**",
    "backups/**",
    ".hx-backups/**",
    "client/src.bak*/**",
    "client/dist/**",
    "dist/**",
    "node_modules/**",
    "content/routes.js",
    "**/*.backup",
    "**/*.bak",
    "**/*.phase*.backup"
  ],
},

  {
    ignores: [
      "docs/**",
      "**/*.backup",
      "**/*.bak",
      "**/*.phase*.backup",
      "phase*-*.mjs",
      "client/dist/**",
      "dist/**",
      "node_modules/**"
    ],
  },


  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/production-backups/**',
      '**/static-export/**',
      '**/archives/**',
      '**/temp/**',
      '**/.cache/**',
      '**/*.min.js'
    ]
  },

  {
    files: ['server/**/*.{js,mjs,ts}'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },

    plugins: {
      'react-hooks': reactHooks,
      "react-hooks": reactHooks,
      '@typescript-eslint': tsPlugin
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-empty': 'warn'
    }
  }
];
