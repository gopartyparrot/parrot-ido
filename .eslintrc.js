module.exports = {
  env: {
    es2021: true,
    browser: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // Uncomment the following lines to enable eslint-config-prettier
    // Is not enabled right now to avoid issues with the Next.js repo
    'prettier',
  ],
  rules: {
    'simple-import-sort/imports': 1,
    'simple-import-sort/exports': 1,
    'import/first': 1,
    'import/newline-after-import': 1,
    'import/no-duplicates': 1,
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
}
