// /pages/_app.jsx
import "aos/dist/aos.css";
import "../styles/globals.css";
import "../styles/sacred.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}