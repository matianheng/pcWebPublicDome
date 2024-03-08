import type { Config } from 'tailwindcss'

import { tailwindSafetyList } from './src/utils/TailwindSafeList'

console.log(`tailwind安全列表:${tailwindSafetyList}`)

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './index.html'],
  safelist: tailwindSafetyList,
  theme: {
    extend: {
      spacing: {
        34: '8.5rem',
        100: '25rem',
        116: '29rem',
        150: '37.5rem',
        230: '57.5rem',
      },
    },
  },
  plugins: [],
} as Config
