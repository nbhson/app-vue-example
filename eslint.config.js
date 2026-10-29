import pluginVue from 'eslint-plugin-vue'
import vueTsConfigs from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,ts,vue}'],
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    },

    ...pluginVue.configs['flat/essential'],
    ...vueTsConfigs(),
    skipFormatting,

    {
        rules: {
            'vue/multi-word-component-names': 'off',
            // Store action signatures declare params for typing only
            // (`interface X { foo(text: string): ... }`) — don't warn.
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { args: 'none', varsIgnorePattern: '^_' }
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
]
