import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import reportWebVitals from "../reportWebVitals";
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
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default JzMengApp;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
