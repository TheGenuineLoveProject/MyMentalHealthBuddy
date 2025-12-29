import ReactDOM from "react-dom/client";
import App from "./App";
import { applyBrand } from "./lib/brand";
import "./index.css";
import "./styles/brand.css";

// Safe initialization - never let branding errors prevent app render
try {
  applyBrand();
} catch (err) {
  console.warn('Brand initialization failed, continuing with defaults:', err);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
