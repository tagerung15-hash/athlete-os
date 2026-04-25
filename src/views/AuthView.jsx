// src/views/AuthView.jsx
import { useState } from 'react';
import { getTeamByCode, getTeamByCoachCode, getPlayerByNamePin, createPlayer, createTeam } from '../lib/supabase';
import { POSITIONS, GYM_FOCUSES, BODY_GOALS } from '../lib/config';

export default function AuthView({ onPlayerLogin, onCoachLogin }) {
  const [mode, setMode] = useState('home'); // home|player_join|player_login|coach|create_team|onboard
  const [teamCode, setTeamCode] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [coachCode, setCoachCode] = useState('');
  const [team, setTeam] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  // Onboarding state
  const [position, setPosition] = useState('');
  const [gymFocus, setGymFocus] = useState('');
  const [bodyGoal, setBodyGoal] = useState('');

  const css = {
    wrap: { minHeight:'100vh', background:'#F8F8F6', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
    box: { background:'white', borderRadius:'16px', border:'1px solid #E0DED7', padding:'2rem', width:'100%', maxWidth:'440px' },
    h1: { fontSize:'22px', fontWeight:'800', marginBottom:'4px', color:'#18181A' },
    sub: { fontSize:'13px', color:'#6B6A66', marginBottom:'1.5rem' },
    label: { fontSize:'12px', fontWeight:'600', color:'#6B6A66', display:'block', marginBottom:'4px' },
    input: { width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #E0DED7', fontSize:'14px', marginBottom:'12px', outline:'none', fontFamily:'inherit' },
    btn: { width:'100%', padding:'11px', borderRadius:'10px', border:'none', background:'#185FA5', color:'white', fontSize:'14px', fontWeight:'700', cursor:'pointer', marginBottom:'8px' },
    btnGhost: { width:'100%', padding:'10px', borderRadius:'10px', border:'1px solid #E0DED7', background:'white', color:'#6B6A66', fontSize:'13px', fontWeight:'600', cursor:'pointer' },
    err: { background:'#FCEBEB', border:'1px solid #E24B4A', borderRadius:'8px', padding:'8px 12px', fontSize:'12px', color:'#A32D2D', marginBottom:'12px' },
    posGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' },
    posCard: (sel) => ({ padding:'10px 12px', borderRadius:'10px', border:`2px solid ${sel?'#185FA5':'#E0DED7'}`, background: sel?'#E6F1FB':'white', cursor:'pointer', textAlign:'center' }),
    posLabel: { fontSize:'13px', fontWeight:'700', marginTop:'4px' },
    posEmoji: { fontSize:'22px' },
  };

  async function joinTeam() {
    setLoading(true); setError('');
    const { data, error } = await getTeamByCode(teamCode);
    if (error || !data) { setError('Team code not found. Check with your coach.'); setLoading(false); return; }
    setTeam(data);
    setMode('player_login');
    setLoading(false);
  }

  async function loginPlayer() {
    setLoading(true); setError('');
    const { data, error } = await getPlayerByNamePin(team.id, name, pin);
    if (error || !data) { setError('Name or PIN not found. Try again or create a new profile.'); setLoading(false); return; }
    onPlayerLogin(data, team);
    setLoading(false);
  }

  async function loginCoach() {
    setLoading(true); setError('');
    const { data, error } = await getTeamByCoachCode(coachCode);
    if (error || !data) { setError('Coach code not found.'); setLoading(false); return; }
    onCoachLogin(data);
    setLoading(false);
  }

  async function createNewTeam() {
    setLoading(true); setError('');
    const { data, error } = await createTeam(newTeamName);
    if (error || !data) { setError('Failed to create team.'); setLoading(false); return; }
    setTeam(data);
    setMode('team_created');
    setLoading(false);
  }

  async function createProfile() {
    if (!position || !gymFocus || !bodyGoal) { setError('Select all options to continue.'); return; }
    if (pin.length !== 4) { setError('PIN must be exactly 4 digits.'); return; }
    setLoading(true); setError('');
    const { data, error } = await createPlayer(team.id, { name, pin, position, gym_focus: gymFocus, body_goal: bodyGoal });
    if (error) { setError('Could not create profile. Name may already exist on this team.'); setLoading(false); return; }
    onPlayerLogin(data, team);
    setLoading(false);
  }

  if (mode === 'home') return (
    <div style={css.wrap}>
      <div style={css.box}>
        <div style={{ fontSize:'32px', marginBottom:'8px' }}>⚽</div>
        <h1 style={css.h1}>Athlete OS</h1>
        <p style={css.sub}>Team performance system. Choose how to enter.</p>
        <button style={css.btn} onClick={() => setMode('player_join')}>Player Login</button>
        <button style={{...css.btn, background:'#1D9E75'}} onClick={() => setMode('coach')}>Coach Dashboard</button>
        <button style={css.btnGhost} onClick={() => setMode('create_team')}>Create New Team</button>
      </div>
    </div>
  );

  if (mode === 'create_team') return (
    <div style={css.wrap}><div style={css.box}>
      <h1 style={css.h1}>Create Team</h1>
      <p style={css.sub}>You'll get a team code to share with players and a coach code to keep private.</p>
      {error && <div style={css.err}>{error}</div>}
      <label style={css.label}>Team name</label>
      <input style={css.input} placeholder="e.g. FC Warriors U21" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} />
      <button style={css.btn} onClick={createNewTeam} disabled={loading || !newTeamName}>{loading ? 'Creating...' : 'Create Team'}</button>
      <button style={css.btnGhost} onClick={() => setMode('home')}>Back</button>
    </div></div>
  );

  if (mode === 'team_created') return (
    <div style={css.wrap}><div style={css.box}>
      <div style={{ fontSize:'32px', marginBottom:'8px' }}>✅</div>
      <h1 style={css.h1}>Team Created!</h1>
      <p style={css.sub}>Save these codes now — they can't be recovered.</p>
      <div style={{ background:'#E1F5EE', borderRadius:'10px', padding:'1rem', marginBottom:'12px' }}>
        <div style={{ fontSize:'11px', fontWeight:'700', color:'#085041', marginBottom:'4px' }}>PLAYER CODE — share with your squad</div>
        <div style={{ fontSize:'28px', fontWeight:'800', color:'#085041', letterSpacing:'3px' }}>{team.team_code}</div>
      </div>
      <div style={{ background:'#E6F1FB', borderRadius:'10px', padding:'1rem', marginBottom:'16px' }}>
        <div style={{ fontSize:'11px', fontWeight:'700', color:'#0C447C', marginBottom:'4px' }}>COACH CODE — keep this private</div>
        <div style={{ fontSize:'22px', fontWeight:'800', color:'#0C447C', letterSpacing:'2px' }}>{team.coach_code}</div>
      </div>
      <button style={css.btn} onClick={() => onCoachLogin(team)}>Enter Coach Dashboard</button>
    </div></div>
  );

  if (mode === 'player_join') return (
    <div style={css.wrap}><div style={css.box}>
      <h1 style={css.h1}>Join Team</h1>
      <p style={css.sub}>Enter the team code your coach gave you.</p>
      {error && <div style={css.err}>{error}</div>}
      <label style={css.label}>Team code</label>
      <input style={{...css.input, textTransform:'uppercase', letterSpacing:'2px', fontSize:'18px', fontWeight:'700'}} placeholder="e.g. ABC12" value={teamCode} onChange={e => setTeamCode(e.target.value.toUpperCase())} maxLength={6} />
      <button style={css.btn} onClick={joinTeam} disabled={loading || teamCode.length < 4}>{loading ? 'Finding team...' : 'Continue'}</button>
      <button style={css.btnGhost} onClick={() => setMode('home')}>Back</button>
    </div></div>
  );

  if (mode === 'player_login') return (
    <div style={css.wrap}><div style={css.box}>
      <div style={{ fontSize:'12px', fontWeight:'700', color:'#1D9E75', marginBottom:'8px' }}>TEAM: {team.name}</div>
      <h1 style={css.h1}>Player Login</h1>
      <p style={css.sub}>Enter your name and PIN to access your profile.</p>
      {error && <div style={css.err}>{error}</div>}
      <label style={css.label}>Your name</label>
      <input style={css.input} placeholder="e.g. Marcus Johnson" value={name} onChange={e => setName(e.target.value)} />
      <label style={css.label}>4-digit PIN</label>
      <input style={css.input} type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} inputMode="numeric" />
      <button style={css.btn} onClick={loginPlayer} disabled={loading || !name || pin.length !== 4}>{loading ? 'Logging in...' : 'Login'}</button>
      <button style={{...css.btnGhost, marginBottom:'8px'}} onClick={() => { setMode('onboard'); setError(''); }}>New player — create profile</button>
      <button style={css.btnGhost} onClick={() => setMode('player_join')}>Back</button>
    </div></div>
  );

  if (mode === 'onboard') return (
    <div style={css.wrap}><div style={{ ...css.box, maxWidth:'560px' }}>
      <div style={{ fontSize:'12px', fontWeight:'700', color:'#1D9E75', marginBottom:'8px' }}>TEAM: {team.name}</div>
      <h1 style={css.h1}>Create Your Profile</h1>
      <p style={css.sub}>Takes 60 seconds. Everything adapts to your answers.</p>
      {error && <div style={css.err}>{error}</div>}
      <label style={css.label}>Your name</label>
      <input style={css.input} placeholder="First + Last name" value={name} onChange={e => setName(e.target.value)} />
      <label style={css.label}>Choose a 4-digit PIN</label>
      <input style={css.input} type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} inputMode="numeric" />
      <label style={{...css.label, marginBottom:'8px'}}>Your position</label>
      <div style={css.posGrid}>
        {Object.entries(POSITIONS).map(([key, pos]) => (
          <div key={key} style={css.posCard(position===key)} onClick={() => setPosition(key)}>
            <div style={css.posEmoji}>{pos.emoji}</div>
            <div style={css.posLabel}>{pos.label}</div>
          </div>
        ))}
      </div>
      <label style={{...css.label, marginBottom:'8px'}}>Gym goal</label>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' }}>
        {Object.entries(GYM_FOCUSES).map(([key, g]) => (
          <button key={key} onClick={() => setGymFocus(key)} style={{ padding:'6px 14px', borderRadius:'20px', border:`2px solid ${gymFocus===key?'#185FA5':'#E0DED7'}`, background:gymFocus===key?'#E6F1FB':'white', fontSize:'12px', fontWeight:'600', cursor:'pointer', color:gymFocus===key?'#0C447C':'#6B6A66' }}>{g.label}</button>
        ))}
      </div>
      <label style={{...css.label, marginBottom:'8px'}}>Body goal</label>
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {Object.entries(BODY_GOALS).map(([key, g]) => (
          <button key={key} onClick={() => setBodyGoal(key)} style={{ flex:1, padding:'8px', borderRadius:'10px', border:`2px solid ${bodyGoal===key?'#185FA5':'#E0DED7'}`, background:bodyGoal===key?'#E6F1FB':'white', fontSize:'12px', fontWeight:'600', cursor:'pointer', color:bodyGoal===key?'#0C447C':'#6B6A66' }}>{g.label}</button>
        ))}
      </div>
      <button style={css.btn} onClick={createProfile} disabled={loading || !name || pin.length!==4 || !position || !gymFocus || !bodyGoal}>{loading ? 'Creating...' : 'Create Profile & Enter'}</button>
      <button style={css.btnGhost} onClick={() => setMode('player_login')}>Back</button>
    </div></div>
  );

  if (mode === 'coach') return (
    <div style={css.wrap}><div style={css.box}>
      <h1 style={css.h1}>Coach Login</h1>
      <p style={css.sub}>Enter your coach code.</p>
      {error && <div style={css.err}>{error}</div>}
      <label style={css.label}>Coach code</label>
      <input style={{...css.input, textTransform:'uppercase', letterSpacing:'2px', fontSize:'16px', fontWeight:'700'}} placeholder="COACH-XXXX" value={coachCode} onChange={e => setCoachCode(e.target.value.toUpperCase())} />
      <button style={{...css.btn, background:'#1D9E75'}} onClick={loginCoach} disabled={loading || !coachCode}>{loading ? 'Verifying...' : 'Enter Dashboard'}</button>
      <button style={css.btnGhost} onClick={() => setMode('home')}>Back</button>
    </div></div>
  );
}
