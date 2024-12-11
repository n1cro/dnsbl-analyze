module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended'],
	root: true,
	env: {
		node: true,
		jest: true
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'no-nested-ternary': 'off',
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'consistent-return': 'off',
		'no-empty': 'off',
		'no-await-in-loop': 'off',
		'prefer-promise-reject-errors': 'off',
		'import/prefer-default-export': 'off',
		'no-plusplus': 'off',
		'no-continue': 'off'
	}
};
