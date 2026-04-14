import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--color-bg-primary)",
                foreground: "var(--color-text-primary)",
            },
            screens: {
                xs: "375px",
            },
            maxWidth: {
                "8xl": "1400px",
            },
        },
    },
    plugins: [],
};

export default config;
