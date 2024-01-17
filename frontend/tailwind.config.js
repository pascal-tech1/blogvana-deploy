// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				inter: ["Graphik", "sans"],
				// Or create a separate font family:
				// graphik: ['Graphik'],
			},
			colors: {
				lightdark: "#202127",
				dark: "#1b1b1f",
				colorPrimary: "#2196F3",
				// ... and so on for other properties
			},
		},
	},
	plugins: [],
};
