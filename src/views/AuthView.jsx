// src/views/AuthView.jsx
import { useState } from 'react';
import { getTeamByCode, getTeamByCoachCode, getPlayerByNamePin, createPlayer, createTeam } from '../lib/supabase';
import { POSITIONS, PERFORMANCE_FOCUS } from '../lib/config';

export default function AuthView({ onPlayerLogin, onCoachLogin }) {
  const [mode, setMode] = useState('home');
  const [teamCode, setTeamCode] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [coachCode, setCoachCode] = useState('');
  const [team, setTeam] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [primaryPos, setPrimaryPos] = useState('');
  const [secondaryPos, setSecondaryPos] = useState('');
  const [perfFocus, setPerfFocus] = useState('');

  const s = {
    wrap:{minHeight:'100vh',background:'#F8F8F6',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'},
    box:{background:'white',borderRadius:'16px',border:'1px solid #E0DED7',padding:'2rem',width:'100%',maxWidth:'480px'},
    h1:{fontSize:'22px',fontWeight:'800',marginBottom:'4px',color:'#18181A'},
    sub:{fontSize:'13px',color:'#6B6A66',marginBottom:'1.5rem'},
    lbl:{fontSize:'12px',fontWeight:'600',color:'#6B6A66',display:'block',marginBottom:'4px'},
    inp:{width:'100%',padding:'9px 12px',borderRadius:'8px',border:'1px solid #E0DED7',fontSize:'14px',marginBottom:'12px',outline:'none',fontFamily:'inherit'},
    btn:{width:'100%',padding:'11px',borderRadius:'10px',border:'none',background:'#185FA5',color:'white',fontSize:'14px',fontWeight:'700',cursor:'pointer',marginBottom:'8px'},
    btnGhost:{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #E0DED7',background:'white',color:'#6B6A66',fontSize:'13px',fontWeight:'600',cursor:'pointer'},
    err:{background:'#FCEBEB',border:'1px solid #E24B4A',borderRadius:'8px',padding:'8px 12px',fontSize:'12px',color:'#A32D2D',marginBottom:'12px'},
  };

  function PosCard({posKey, selected, onClick, disabled}) {
    const pos = POSITIONS[posKey];
    const isSelected = selected === posKey;
    const isDisabled = disabled === posKey;
    return (
      <div onClick={!isDisabled ? onClick : undefined} style={{
        padding:'10px 12px', borderRadius:'10px',
        border:`2px solid ${isSelected?pos.color:isDisabled?'#F0EEE8':'#E0DED7'}`,
        background: isSelected?pos.colorLight:isDisabled?'#F9F8F6':'white',
        cursor: isDisabled?'not-allowed':'pointer', textAlign:'center',
        opacity: isDisabled?0.4:1,
      }}>
        <div style={{fontSize:'22px'}}>{pos.emoji}</div>
        <div style={{fontSize:'12px',fontWeight:'700',marginTop:'3px',color:isSelected?pos.color:'#18181A'}}>{pos.label}</div>
        <div style={{fontSize:'10px',color:'#6B6A66',marginTop:'1px'}}>{pos.gymPriority}</div>
      </div>
    );
  }

  async function joinTeam() {
    setLoading(true); setError('');
    const {data,error} = await getTeamByCode(teamCode);
    if (error||!data){setError('Team code not found. Check with your coach.');setLoading(false);return;}
    setTeam(data); setMode('player_login'); setLoading(false);
  }

  async function loginPlayer() {
    setLoading(true); setError('');
    const {data,error} = await getPlayerByNamePin(team.id,name,pin);
    if (error||!data){setError('Name or PIN not found. Try again or create a new profile.');setLoading(false);return;}
    onPlayerLogin(data,team); setLoading(false);
  }

  async function loginCoach() {
    setLoading(true); setError('');
    const {data,error} = await getTeamByCoachCode(coachCode);
    if (error||!data){setError('Coach code not found.');setLoading(false);return;}
    onCoachLogin(data); setLoading(false);
  }

  async function createNewTeam() {
    setLoading(true); setError('');
    const {data,error} = await createTeam(newTeamName);
    if (error||!data){setError('Failed to create team.');setLoading(false);return;}
    setTeam(data); setMode('team_created'); setLoading(false);
  }

  async function createProfile() {
    if (!primaryPos||!perfFocus){setError('Select your position and performance focus to continue.');return;}
    if (pin.length!==4){setError('PIN must be exactly 4 digits.');return;}
    if (!name.trim()){setError('Enter your name.');return;}
    setLoading(true); setError('');
    const {data,error} = await createPlayer(team.id,{
      name:name.trim(), pin, position:primaryPos,
      secondary_position: secondaryPos||null,
      gym_focus:'position_based',
      performance_focus: perfFocus,
      body_goal: perfFocus, // legacy compat
    });
    if (error){setError('Could not create profile. Name may already exist on this team.');setLoading(false);return;}
    onPlayerLogin(data,team); setLoading(false);
  }

  if (mode==='home') return (
    <div style={s.wrap}><div style={s.box}>
      <div style={{fontSize:'36px',marginBottom:'8px'}}>⚽</div>
      <h1 style={s.h1}>Athlete OS</h1>
      <p style={s.sub}>Team performance system. Choose how to enter.</p>
      <button style={s.btn} onClick={()=>setMode('player_join')}>Player Login</button>
      <button style={{...s.btn,background:'#1D9E75'}} onClick={()=>setMode('coach')}>Coach Dashboard</button>
      <button style={s.btnGhost} onClick={()=>setMode('create_team')}>Create New Team</button>
    </div></div>
  );

  if (mode==='create_team') return (
    <div style={s.wrap}><div style={s.box}>
      <h1 style={s.h1}>Create Team</h1>
      <p style={s.sub}>You will get a team code to share with players and a coach code to keep private.</p>
      {error&&<div style={s.err}>{error}</div>}
      <label style={s.lbl}>Team name</label>
      <input style={s.inp} placeholder="e.g. FC Warriors U21" value={newTeamName} onChange={e=>setNewTeamName(e.target.value)}/>
      <button style={s.btn} onClick={createNewTeam} disabled={loading||!newTeamName}>{loading?'Creating...':'Create Team'}</button>
      <button style={s.btnGhost} onClick={()=>setMode('home')}>Back</button>
    </div></div>
  );

  if (mode==='team_created') return (
    <div style={s.wrap}><div style={s.box}>
      <div style={{fontSize:'32px',marginBottom:'8px'}}>✅</div>
      <h1 style={s.h1}>Team Created!</h1>
      <p style={s.sub}>Save these codes now — they cannot be recovered.</p>
      <div style={{background:'#E1F5EE',borderRadius:'10px',padding:'1rem',marginBottom:'12px'}}>
        <div style={{fontSize:'11px',fontWeight:'700',color:'#085041',marginBottom:'4px'}}>PLAYER CODE — share with your squad</div>
        <div style={{fontSize:'28px',fontWeight:'800',color:'#085041',letterSpacing:'3px'}}>{team.team_code}</div>
      </div>
      <div style={{background:'#E6F1FB',borderRadius:'10px',padding:'1rem',marginBottom:'16px'}}>
        <div style={{fontSize:'11px',fontWeight:'700',color:'#0C447C',marginBottom:'4px'}}>COACH CODE — keep this private</div>
        <div style={{fontSize:'22px',fontWeight:'800',color:'#0C447C',letterSpacing:'2px'}}>{team.coach_code}</div>
      </div>
      <button style={s.btn} onClick={()=>onCoachLogin(team)}>Enter Coach Dashboard</button>
    </div></div>
  );

  if (mode==='player_join') return (
    <div style={s.wrap}><div style={s.box}>
      <h1 style={s.h1}>Join Team</h1>
      <p style={s.sub}>Enter the team code your coach gave you.</p>
      {error&&<div style={s.err}>{error}</div>}
      <label style={s.lbl}>Team code</label>
      <input style={{...s.inp,textTransform:'uppercase',letterSpacing:'2px',fontSize:'18px',fontWeight:'700'}} placeholder="e.g. ABC12" value={teamCode} onChange={e=>setTeamCode(e.target.value.toUpperCase())} maxLength={6}/>
      <button style={s.btn} onClick={joinTeam} disabled={loading||teamCode.length<4}>{loading?'Finding team...':'Continue'}</button>
      <button style={s.btnGhost} onClick={()=>setMode('home')}>Back</button>
    </div></div>
  );

  if (mode==='player_login') return (
    <div style={s.wrap}><div style={s.box}>
      <div style={{fontSize:'12px',fontWeight:'700',color:'#1D9E75',marginBottom:'8px'}}>TEAM: {team.name}</div>
      <h1 style={s.h1}>Player Login</h1>
      <p style={s.sub}>Enter your name and PIN.</p>
      {error&&<div style={s.err}>{error}</div>}
      <label style={s.lbl}>Your name</label>
      <input style={s.inp} placeholder="e.g. Marcus Johnson" value={name} onChange={e=>setName(e.target.value)}/>
      <label style={s.lbl}>4-digit PIN</label>
      <input style={s.inp} type="password" placeholder="••••" value={pin} onChange={e=>setPin(e.target.value)} maxLength={4} inputMode="numeric"/>
      <button style={s.btn} onClick={loginPlayer} disabled={loading||!name||pin.length!==4}>{loading?'Logging in...':'Login'}</button>
      <button style={{...s.btnGhost,marginBottom:'8px'}} onClick={()=>{setMode('onboard');setError('');}}>New player — create profile</button>
      <button style={s.btnGhost} onClick={()=>setMode('player_join')}>Back</button>
    </div></div>
  );

  if (mode==='onboard') return (
    <div style={s.wrap}><div style={{...s.box,maxWidth:'580px'}}>
      <div style={{fontSize:'12px',fontWeight:'700',color:'#1D9E75',marginBottom:'8px'}}>TEAM: {team.name}</div>
      <h1 style={s.h1}>Create Your Profile</h1>
      <p style={s.sub}>60 seconds. Everything adapts to your answers.</p>
      {error&&<div style={s.err}>{error}</div>}

      <label style={s.lbl}>Your name</label>
      <input style={s.inp} placeholder="First + Last name" value={name} onChange={e=>setName(e.target.value)}/>

      <label style={s.lbl}>Choose a 4-digit PIN</label>
      <input style={s.inp} type="password" placeholder="••••" value={pin} onChange={e=>setPin(e.target.value)} maxLength={4} inputMode="numeric"/>

      <label style={{...s.lbl,marginBottom:'8px'}}>Primary position <span style={{color:'#E24B4A'}}>*</span></label>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'12px'}}>
        {Object.keys(POSITIONS).map(k=>(
          <PosCard key={k} posKey={k} selected={primaryPos} onClick={()=>{setPrimaryPos(k);if(secondaryPos===k)setSecondaryPos('');}} disabled={secondaryPos===k?k:null}/>
        ))}
      </div>

      <label style={{...s.lbl,marginBottom:'4px'}}>Secondary position <span style={{color:'#6B6A66',fontWeight:'400'}}>(optional — max 1)</span></label>
      <p style={{fontSize:'11px',color:'#6B6A66',marginBottom:'8px'}}>If you play multiple roles. Training will combine both positions.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'14px'}}>
        {Object.keys(POSITIONS).map(k=>(
          <PosCard key={k} posKey={k} selected={secondaryPos} onClick={()=>setSecondaryPos(secondaryPos===k?'':k)} disabled={primaryPos===k?k:null}/>
        ))}
      </div>

      <label style={{...s.lbl,marginBottom:'8px'}}>Performance focus <span style={{color:'#E24B4A'}}>*</span></label>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
        {Object.entries(PERFORMANCE_FOCUS).map(([k,f])=>(
          <button key={k} onClick={()=>setPerfFocus(k)} style={{padding:'7px 14px',borderRadius:'20px',border:`2px solid ${perfFocus===k?'#185FA5':'#E0DED7'}`,background:perfFocus===k?'#E6F1FB':'white',fontSize:'12px',fontWeight:'600',cursor:'pointer',color:perfFocus===k?'#0C447C':'#6B6A66'}}>{f.label}</button>
        ))}
      </div>

      <button style={s.btn} onClick={createProfile} disabled={loading||!name||pin.length!==4||!primaryPos||!perfFocus}>
        {loading?'Creating...':'Create Profile & Enter'}
      </button>
      <button style={s.btnGhost} onClick={()=>setMode('player_login')}>Back</button>
    </div></div>
  );

  if (mode==='coach') return (
    <div style={s.wrap}><div style={s.box}>
      <h1 style={s.h1}>Coach Login</h1>
      <p style={s.sub}>Enter your coach code.</p>
      {error&&<div style={s.err}>{error}</div>}
      <label style={s.lbl}>Coach code</label>
      <input style={{...s.inp,textTransform:'uppercase',letterSpacing:'2px',fontSize:'16px',fontWeight:'700'}} placeholder="COACH-XXXX" value={coachCode} onChange={e=>setCoachCode(e.target.value.toUpperCase())}/>
      <button style={{...s.btn,background:'#1D9E75'}} onClick={loginCoach} disabled={loading||!coachCode}>{loading?'Verifying...':'Enter Dashboard'}</button>
      <button style={s.btnGhost} onClick={()=>setMode('home')}>Back</button>
    </div></div>
  );
}
