import React, { useState, useEffect } from 'react';
import { LoginScreen } from './modules/auth/LoginScreen';
import RifaDashboard from './modules/rifa/RifaDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Easter Egg: Dev Signature
  useEffect(() => {
    console.log("🚀 Rifa System decolando! Initialized by Dev Pamela M.S");
  }, []);

  // Module Orchestration - Only responsible for top-level switching

  return (
    <div className="app-container">
      {/* Module Orchestration - Only responsible for top-level switching */}
      {showLogin && (
        <LoginScreen
          onLogin={() => { setIsAuthenticated(true); setShowLogin(false); }}
          onBack={() => setShowLogin(false)}
        />
      )}

      <RifaDashboard
        isAuthenticated={isAuthenticated}
        onRequestLogin={() => setShowLogin(true)}
        onLogout={() => setIsAuthenticated(false)}
      />
    </div>
  );
}
