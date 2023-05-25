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
			red: {
				300: "#CB4A48",
				400: "#E02527",
				600: "#99191B",
				800: "#661112",
			},
			coral: {
				300: "FB923C",
				400: "#FF7F50",
				600: "#C2410C",
			},
			grey: {
				300: "#DCDCDC",
				400: "#D9D9D9",
				600: "#6f6a6a",
				800: "#303338",
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
