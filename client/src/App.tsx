import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading backend status...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/health`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('❌ Unable to reach backend.'));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '50px' }}>
      <h1>💙 MyMentalHealthBuddy</h1>
      <h2>{message}</h2>
      <p>Frontend and backend are now connected!</p>
    </div>
  );
}

export default App;