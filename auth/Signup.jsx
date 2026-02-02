// Signup.jsx (same structure, using createUserWithEmailAndPassword)
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto space-y-4">
      <input className="w-full border p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border p-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-deepTeal text-white p-2 w-full rounded" type="submit">Signup</button>
    </form>
  );
}