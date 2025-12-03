import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initSentry } from "./lib/sentry";
import CrisisResources from "./pages/CrisisResources.jsx";

<Route path="/crisis" element={<CrisisResources />} />
initSentry();

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);