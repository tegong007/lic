import antfu from '@antfu/eslint-config';

export default antfu({
  markdown: false,
  yaml: false,
  unocss: true,
  formatters: true,
  jsx: false,
  stylistic: {
    indent: 2,
    semi: true,
  },
  rules: {
    'n/prefer-global/process': 'off',
    'no-undef': 'off',
    'no-fallthrough': 'off',
    'vue/block-order': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'prefer-promise-reject-errors': 'off',
    'import/no-mutable-exports': 'off',
    'ts/no-empty-object-type': 'off',
    'ts/no-unused-expressions': 'off',
    'no-console': 'off',
    'jsonc/no-useless-escape': 'off',
  },
  languageOptions: {
    globals: {
      h: 'readonly',
      unref: 'readonly',
      provide: 'readonly',
      inject: 'readonly',
      markRaw: 'readonly',
      defineAsyncComponent: 'readonly',
      nextTick: 'readonly',
      useRoute: 'readonly',
      useRouter: 'readonly',
      Message: 'readonly',
      $loadingBar: 'readonly',
      $message: 'readonly',
      $dialog: 'readonly',
      $notification: 'readonly',
      $modal: 'readonly',
    },
  },
}, {
  files: ['**/src/**'],
  settings: {
    'import/core-modules': ['vue-router/auto-routes'],
  },
});
