module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
    env: {
      es6: true,
      node: true,
      browser: true,
    },
    rules: {
      'global-require': 'off',
      'no-console': 'warn',
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'always'],
      'react/prop-types': 'off',
    },
};
