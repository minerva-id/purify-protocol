import next from 'eslint-config-next';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...next,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
