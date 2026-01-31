/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                comic: ['"Comic Sans MS"', 'cursive'],
            },
            colors: {
                cream: "#FFF4D6",
                lightPink: "#F5A3C7",
                lightGreen: "#9AE6B4",
            },
            keyframes: {
                wiggle: {
                    "0%,100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 0.25s ease-in-out",
            },
        },
    },
    plugins: [],
};
