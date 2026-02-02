import LotusGuide from './sacred/LotusGuide';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JournalPage from './pages/JournalPage';
import OnboardingFlow from './pages/OnboardingFlow';
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WellnessDashboard from "./components/WellnessDashboard";
import SacredBackground from "./sacred/SacredBackground";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <WellnessDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
function App() {
  return (
    <>
      <LandingPage />
      <LotusGuide />
    </>
  );
}