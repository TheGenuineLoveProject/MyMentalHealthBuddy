import { useEffect, useState } from 'react';

export default function BillingStatus() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/billing/status')
      .then(res => res.json())
      .then(data => setStatus(data.active ? '✅ Pro Active' : '❌ Free'));
  }, []);

  return <div>{status}</div>;
}