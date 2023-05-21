/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
		"./src/pages/*.{js,ts,jsx,tsx}",
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		colors: {
			white: {
				DEFAULT: "#FFFFFF",
				600: "#d5d5d5",
			},
			coral: {
				300: "#FF7F50",
			},
			grey: {
				300: "#DCDCDC",
				600: "#6f6a6a",
			},
			black: {
				DEFAULT: "#000000",
				900: "#0f0f0f",
			},
		},
		fontFamily: {
			sans: ["Futura", "Roboto", "Oxygen", "Segoe UI", "sans-serif"],
			display: ["Roboto, Oxygen", "Segoe UI", "sans-serif"],
		},
	},
	plugins: [],
};
