// src/App.jsx
import { useState, useEffect } from 'react';
import AuthView from './views/AuthView';
import PlayerView from './views/PlayerView';
import CoachView from './views/CoachView';

const SESSION_KEY = 'athleteos_session';

export default function App() {
  const [session, setSession] = useState(null); // { type: 'player'|'coach', player?, team }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setSession(JSON.parse(saved));
    } catch (e) {}
    setLoading(false);
  }, []);

  function handlePlayerLogin(player, team) {
    const sess = { type: 'player', player, team };
    setSession(sess);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(sess)); } catch (e) {}
  }

  function handleCoachLogin(team) {
    const sess = { type: 'coach', team };
    setSession(sess);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(sess)); } catch (e) {}
  }

  function handleLogout() {
    setSession(null);
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8F6' }}>
      <div style={{ fontSize: 32 }}>⚽</div>
    </div>
  );

  if (!session) {
    return <AuthView onPlayerLogin={handlePlayerLogin} onCoachLogin={handleCoachLogin} />;
  }

  if (session.type === 'coach') {
    return <CoachView team={session.team} onLogout={handleLogout} />;
  }

  if (session.type === 'player') {
    return <PlayerView player={session.player} team={session.team} onLogout={handleLogout} />;
  }

  return <AuthView onPlayerLogin={handlePlayerLogin} onCoachLogin={handleCoachLogin} />;
}
