import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/icons/favicon.png" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="a selection of personal projects" />
          <link rel="apple-touch-icon" href="/icons/favicon.png" />
          <meta property="og:url" content="https://jz-dot-meng.github.io" />
          <meta
            property="og:title"
            content="@jz-dot-meng :: an online alias for jeff zhang"
          />
          <meta
            property="og:description"
            content="a selection of personal projects"
          />
          <meta property="og:image" content="/icons/favicon.png" />
          {/*
            Notice the use of %PUBLIC_URL% in the tags above.
            It will be replaced with the URL of the `public` folder during the build.
            Only files inside the `public` folder can be referenced from the HTML.
            
            Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
            work correctly both with client-side routing and a non-root public URL.
            Learn how to configure a non-root public URL by running `npm run build`.
        */}
        </Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>@jz-dot-meng</title>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
