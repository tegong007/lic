import antfu from '@antfu/eslint-config';

export default antfu(
  {
    markdown: false,
    yaml: false,
    unocss: true,
    formatters: true,
    jsx: false,
    stylistic: {
      indent: 2,
      semi: true,
      tabs: true, // 添加这个选项，允许使用 Tab 键缩进
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
      'style/no-tabs': 'off', // 禁用 style/no-tabs 规则
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
  },
  {
    files: ['**/src/**'],
    settings: {
      'import/core-modules': ['vue-router/auto-routes'],
    },
  },
);
