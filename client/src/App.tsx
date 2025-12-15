import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Crisis from "./pages/Crisis";

const BrandHeader = () => (
  <header style={{
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "18px 16px",
    background: "linear-gradient(180deg, rgba(80,120,105,0.22), rgba(20,24,22,0))"
  }}>
    <div style={{maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", gap: 12}}>
      <img
        src="/brand/logo.png"
        alt="The Genuine Love Project"
        style={{width: 40, height: 40, borderRadius: 10}}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <div style={{flex: 1}}>
        <div style={{fontSize: 18, fontWeight: 700, letterSpacing: 0.2}}>The Genuine Love Project</div>
        <div style={{opacity: 0.85, fontSize: 13}}>Live in Genuine Love</div>
      </div>
      <nav style={{display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end"}}>
        <Link style={navLink} to="/legal">Legal</Link>
        <Link style={navLink} to="/terms">Terms</Link>
        <Link style={navLink} to="/privacy">Privacy</Link>
        <Link style={navLink} to="/disclaimer">Disclaimer</Link>
        <Link style={navLink} to="/crisis">Crisis</Link>
      </nav>
    </div>
  </header>
);

const navLink: React.CSSProperties = {
  color: "rgba(245, 248, 246, 0.92)",
  textDecoration: "none",
  fontSize: 13,
  padding: "8px 10px",
  borderRadius: 10,
  background: "rgba(80,120,105,0.16)"
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    minHeight: "100vh",
    color: "rgb(245,248,246)",
    background: "radial-gradient(1200px 600px at 10% 0%, rgba(80,120,105,0.35), rgba(10,12,11,1))"
  }}>
    <BrandHeader />
    <main style={{maxWidth: 980, margin: "0 auto", padding: "20px 16px 64px"}}>
      {children}
    </main>
    <footer style={{opacity: 0.75, fontSize: 12, padding: "22px 16px"}}>
      <div style={{maxWidth: 980, margin: "0 auto"}}>
        © {new Date().getFullYear()} The Genuine Love Project • Not medical advice
      </div>
    </footer>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Legal />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/crisis" element={<Crisis />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}