/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: 'var(--border)', // Map the `--border` CSS variable
                ring: 'var(--ring)', // Map to your CSS variable
                background: 'var(--background)',
                foreground: 'var(--foreground)', // Map the `--foreground` CSS variable
            }
        },
    },
    plugins: [],
}
export default config;
