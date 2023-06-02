/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Neue Haas', 'sans-serif']
		},
		colors: {
			primary: '#1F1F1F',
			secondary: '#C2C2C2',
			tertiary: '#D9D9D9',
			white: '#FFFFFF'
		},
		extend: {}
	},
	plugins: []
};
