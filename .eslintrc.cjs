module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.app.json', 'tsconfig.spec.json'],
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@angular-eslint/no-host-metadata-property': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/eqeqeq': 'error',
        '@angular-eslint/template/no-any': 'warn',
      },
    },
  ],
};
