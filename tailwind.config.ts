/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            // ... tus colores bluvi ...
            'bluvi-purple': '#4D55A6', 
        },
        fontFamily: {
            sans: ['Manrope', 'sans-serif'],     
            heading: ['"Lexend Deca"', 'sans-serif'],
        },
        },
    },
    plugins: [],
}