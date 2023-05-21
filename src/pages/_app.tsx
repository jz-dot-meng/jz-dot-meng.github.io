import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";

function JzMengApp({ Component, pageProps }: AppProps) {
	/**
	 * remove dev console logging from prod
	 */
	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			console.log = () => {};
			// console.warn = () => {};
			//   console.error = () => {}; // log all our errors for the world to see :o
			// console.debug = () => {};
		}
	}, []);
	return <Component {...pageProps} />;
}

export default JzMengApp;
