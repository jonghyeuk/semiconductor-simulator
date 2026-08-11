/* This project is CRA + plain JavaScript: there is no `tsc` gate, so unlike the
   TypeScript setup this config is the *only* thing catching unused bindings and
   undeclared variables. Those rules stay ON here. */
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ['react-app', 'react-app/jest'],
  ignorePatterns: ['build', 'node_modules', 'public', 'src/data', 'coverage'],
  rules: {
    // Hook dependency mistakes silently produce stale physics inputs.
    'react-hooks/exhaustive-deps': 'warn',
    // `case` blocks that declare with const/let leak across branches.
    'no-case-declarations': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
  },
  overrides: [
    {
      files: ['scripts/**/*.js', '*.config.js'],
      env: { node: true, browser: false },
    },
    {
      files: ['**/*.test.js', 'src/physics/**'],
      rules: { 'no-console': 'off' },
    },
  ],
};
