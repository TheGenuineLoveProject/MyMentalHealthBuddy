import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 rounded bg-white shadow-md space-y-4">
      <h1 className="text-xl font-bold">🧠 MyMentalHealthBuddy Dashboard</h1>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-green-100 rounded">✅ Platform Status: Healthy</div>
        <div className="p-4 bg-blue-100 rounded">🧪 Test Coverage: 100%</div>
        <div className="p-4 bg-purple-100 rounded">🤖 AI Employees: 12 Assigned</div>
        <div className="p-4 bg-yellow-100 rounded">🔁 Last Deploy: Auto CI/CD</div>
      </div>
    </div>
  );
}