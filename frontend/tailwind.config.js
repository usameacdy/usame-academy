/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000666',
                secondary: '#006876',
                tertiary: '#ffba38',
                surface: '#f9f9f9',
                'on-surface': '#1c1c1c',
                'on-surface-variant': '#5a5a5a',
                'outline-variant': 'rgba(0, 6, 102, 0.08)',
                'surface-container': '#f3f3f3',
                'surface-container-high': '#ececec',
                'surface-container-highest': '#e0e0e0',
                'surface-container-low': '#f3f3f3',
                'surface-container-lowest': '#ffffff',
            },
        },
    },
    plugins: [],
}
