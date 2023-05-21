import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContextProvider } from "context/ToastContext";
import { MusicContextProvider } from "context/MusicContext";

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
	return (
		<ToastContextProvider>
			<MusicContextProvider>
				<Component {...pageProps} />
			</MusicContextProvider>
		</ToastContextProvider>
	);
}

export default JzMengApp;
