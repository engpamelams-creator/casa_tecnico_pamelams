import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoginScreen } from './modules/auth/LoginScreen';
import RifaDashboard from './modules/rifa/RifaDashboard';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AchievementsProvider } from './shared/context/AchievementsContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Easter Egg: Dev Signature
  useEffect(() => {
    console.log("🚀 Rifa System decolando! Initialized by Dev Pamela M.S");
  }, []);

  return (
    <ThemeProvider>
      <AchievementsProvider>
        <div className="app-container">
          <Toaster />

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
      </AchievementsProvider>
    </ThemeProvider>
  );
}
