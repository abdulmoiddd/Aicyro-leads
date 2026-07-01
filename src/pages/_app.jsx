// src/pages/_app.jsx
import "@/styles/globals.css";
import RootLayout from "./layout";
import ThemeProvider from "../components/ThemeProvider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ThemeProvider>
  );
}
