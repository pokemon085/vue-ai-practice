import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * ESLint flat config（ESLint 9）
 *
 * 規範重點：
 * - Vue 3 + TypeScript：eslint-plugin-vue + typescript-eslint
 * - 格式化交由 Prettier，eslint-config-prettier 關閉衝突規則
 * - 不啟用 type-aware 規則（較慢且易誤報）；型別正確性由 `npm run typecheck` / `npm run build` 把關
 */
export default tseslint.config(
  // 1. 忽略產物與依賴
  {
    name: 'metrix/ignores',
    ignores: ['dist/**', 'dist-ssr/**', 'node_modules/**', 'coverage/**'],
  },

  // 2. JS / TS / Vue：ESLint 核心規則 + TypeScript 建議規則
  {
    name: 'metrix/js-ts-vue',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },

  // 3. Vue 官方規則（須排在 TS 之後，讓 .vue 改用 vue-eslint-parser）
  ...pluginVue.configs['flat/recommended'],

  // 4. .vue 內的 <script lang="ts"> 再交給 TypeScript parser 解析
  {
    name: 'metrix/vue-typescript',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // 5. 專案自訂規則
  {
    name: 'metrix/rules',
    rules: {
      // TypeScript：明確型別優先，避免 any 與不必要的斷言
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Vue 元件
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'] },
      ],
      'vue/no-v-html': 'error',

      // 一般程式碼品質
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      // 未定義變數交由 TypeScript 檢查，避免 ESLint 對 TS 型別誤報
      'no-undef': 'off',
    },
  },

  // 6. 建置設定檔與 Node 環境腳本
  {
    name: 'metrix/node-config-files',
    files: ['**/*.config.{js,ts,mjs,cjs}', 'scripts/**/*.{js,ts,mjs,cjs}'],
    languageOptions: { globals: { ...globals.node } },
  },

  // 7. Prettier 相容設定，必須放最後
  configPrettier,
)
