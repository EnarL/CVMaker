import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}', // Adjusted for TypeScript
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;