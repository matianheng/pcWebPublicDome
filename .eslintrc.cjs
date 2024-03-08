module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 解决 defineProps and defineEmits generate no-undef warnings
    'vue/setup-compiler-macros': true,
    node: true,
  },
  extends: [
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    //1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
    'plugin:prettier/recommended',
    // 让eslint识别unplugin-auto-import插件的自动导入的组件。详见: https://blog.csdn.net/sayUonly/article/details/123482912
    './.eslintrc-auto-import.json',
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      // 使用jsx的话需要配置这个
      jsx: true,
    },
  },
  plugins: ['vue', '@typescript-eslint'],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', //生产默认不允许使用debugger
    'prettier/prettier': ['error', { endOfLine: 'auto', printWidth: 80 }],
    // 解决 <script setup> 中eslint不工作问题
    'vue/script-setup-uses-vars': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
