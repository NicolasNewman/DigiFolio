module.exports = {
    extends: 'erb',
    rules: {
        // A temporary hack related to IDE not resolving correct package.json
        'import/no-extraneous-dependencies': 'off',
        'react/no-unused-prop-types': 'warn',
        'react/static-property-placement': 'off',
        'react/destructuring-assignment': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/no-empty-interface': 'warn',
        'no-floating-decimal': 'error',
        'no-magic-numbers': 'warn',
        'no-return-await': 'error',
        'no-var': 'error',
        'no-useless-constructor': 'off',
        'promise/always-return': 'off',
        'require-await': 'warn',
        'default-case': 'error',
        'spaced-comment': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': 'off',
        curly: 'error',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
    },
    settings: {
        'import/resolver': {
            // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
            node: {},
            webpack: {
                config: require.resolve(
                    './.erb/configs/webpack.config.eslint.js'
                ),
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
};
