/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    gold: '#D19E31', // Mustard Yellow (Accent)
                    green: '#4B5930', // Olive Green (Primary)
                    dark: '#2A3013', // Dark Olive
                    light: '#FDFBF7', // Cream/Off-white
                    accent: '#E6C16E', // Gold (Highlight)
                }
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
