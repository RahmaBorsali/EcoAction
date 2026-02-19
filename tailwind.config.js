/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2D6A4F",
                    light: "#40916C",
                    dark: "#1B3A2D",
                },
                accent: {
                    DEFAULT: "#52B788",
                    light: "#74C69D",
                    dark: "#3A956C",
                },
                warm: {
                    DEFAULT: "#F4A261",
                    light: "#F7C59F",
                    dark: "#E07B39",
                },
                eco: {
                    bg: "#F0F7F4",
                    card: "#FFFFFF",
                    border: "#D8EEE4",
                    text: "#2D3436",
                    muted: "#636E72",
                },
            },
            fontFamily: {
                sans: ["System"],
            },
        },
    },
    plugins: [],
};
