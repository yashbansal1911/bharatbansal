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
                    gold: '#C5A028', // Metallic Gold
                    green: '#0F3D2E', // Forest Green
                    dark: '#0A0A0A', // Rich Black
                    light: '#FDFBF7', // Cream/Off-white
                    accent: '#E6D5B8', // Soft Beige
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
