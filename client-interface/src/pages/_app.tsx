import { UserContextProvider } from "@context/UserContext";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { MusicContextProvider } from "../context/MusicContext";
import { ToastContextProvider } from "../context/ToastContext";
import "../styles/globals.css";

function JzMengApp({ Component, pageProps }: AppProps) {
    /**
     * remove dev console logging from prod
     */
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            console.log = () => {
                /** */
            };
            // console.warn = () => {};
            //   console.error = () => {}; // log all our errors for the world to see :o
            // console.debug = () => {};
        }
    }, []);
    return (
        <UserContextProvider>
            <ToastContextProvider>
                <MusicContextProvider>
                    <Component {...pageProps} />
                </MusicContextProvider>
            </ToastContextProvider>
        </UserContextProvider>
    );
}

export default JzMengApp;
