import ReactDOM from "react-dom/client";
import App from "./App";
import { applyBrand } from "./lib/brand";
import "./index.css";
import "./styles/brand.css";

applyBrand();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
