module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 6,
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'global-require': 'off',
      'no-console': 'warn',
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'always'],
    },
};
