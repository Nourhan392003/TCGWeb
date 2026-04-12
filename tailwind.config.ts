import type { Config } from "tailwindcss";

const config: Config = {
    content: [

        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",

    ],
    safelist: [
        "text-amber-500",
        "text-purple-500",
        "text-emerald-500",
        "text-red-500",
        "text-blue-500",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};

export default config;
