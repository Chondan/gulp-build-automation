module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 8,
    },
    rules: {
        indent: ['error', 4],
        'max-len': [2, 80, 4, { ignoreUrls: true }],
    },
    ignorePatterns: ['bin/', 'node_modules/', '**/*.test.js'],
};
