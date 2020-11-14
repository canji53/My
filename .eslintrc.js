module.exports = {
  env: {
    node: true,
    es2020: true,
    jest: true
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier'
  ],
  // 順序に注意、上位は下位でルールの上書きがあるため
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  // tsconfig.eslint.jsonは、eslintがパース対象のファイル・ディレクトリを
  // 示したもの。分離しないとVSCodeと連携した際、パース時に重くなるバグがあるらしい。(2020/11/xx)
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  // 設定ファイルがrootにあることを明示。eslintは親ディレクトリまで見に行ってしまうため。
  root: true,
  // extends 以外の独自ルールおよび、extends の強い縛りの抜け穴を作る。
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        semi: false
      }
    ],
    // 未使用変数が _ の場合は許可
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '_',
        ignoreRestSiblings: false,
        varsIgnorePattern: '_'
      }
    ],
    // import時に、js,ts は拡張子の省略を許可
    'import/extensions': [
      'error',
      'ignorePackages', {
        js: 'never',
        ts: 'never'
      }
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      }
    }
  }
}