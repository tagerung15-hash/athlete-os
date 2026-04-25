// src/views/PlayerView.jsx
import { useState, useEffect } from 'react';
import { getCheckins, saveCheckin, getGames, saveGame, getLiftLogs, saveLiftLog, getMeasurements, saveMeasurement, updatePlayer } from '../lib/supabase';
import { POSITIONS, GYM_FOCUSES, BODY_GOALS, calcNutrition, calcScore } from '../lib/config';

const C = {
  bg:'#F8F8F6',card:'#fff',border:'#E0DED7',text:'#18181A',muted:'#6B6A66',
  teal:'#1D9E75',tealDk:'#085041',tealLt:'#E1F5EE',
  blue:'#185FA5',blueDk:'#0C447C',blueLt:'#E6F1FB',
  amber:'#BA7517',amberLt:'#FAEEDA',
  red:'#E24B4A',redLt:'#FCEBEB',
  purple:'#5B3FA8',purpleLt:'#EEEDFE',
};

function Hbox({ color='green', children }) {
  const map = { green:[C.tealLt,C.teal,C.tealDk], amber:[C.amberLt,C.amber,C.amber], blue:[C.blueLt,C.blue,C.blueDk], red:[C.redLt,C.red,'#7A1F1F'] };
  const [bg,border,text] = map[color]||map.green;
  return <div style={{ background:bg,borderLeft:`3px solid ${border}`,color:text,borderRadius:'0 6px 6px 0',padding:'7px 11px',marginTop:8,fontSize:12,lineHeight:1.6 }}>{children}</div>;
}
function Bar({ value, color=C.blue }) {
  return <div style={{ background:'#e0ddd7',borderRadius:20,height:7,overflow:'hidden',marginTop:3,border:`0.5px solid ${C.border}` }}><div style={{ width:`${Math.min(100,value||0)}%`,height:'100%',background:color,borderRadius:20,transition:'width .5s' }}/></div>;
}
function Sh({ children }) {
  return <div style={{ fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.8px',color:C.muted,margin:'1.2rem 0 .4rem',borderBottom:`1px solid ${C.border}`,paddingBottom:4 }}>{children}</div>;
}
function Card({ children, style }) {
  return <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.1rem',marginBottom:'.75rem',...style }}>{children}</div>;
}
function Inp({ label, ...props }) {
  return <div style={{ marginBottom:8 }}>
    {label && <label style={{ fontSize:11,color:C.muted,display:'block',marginBottom:3 }}>{label}</label>}
    <input style={{ width:'100%',padding:'6px 9px',borderRadius:7,border:`1px solid ${C.border}`,fontSize:13,fontFamily:'inherit',background:'white' }} {...props}/>
  </div>;
}
function TblWrap({ children }) {
  return <div style={{ overflowX:'auto' }}><table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>{children}</table></div>;
}
function Th({ children }) { return <th style={{ background:C.bg,padding:'7px 9px',textAlign:'left',fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,whiteSpace:'nowrap' }}>{children}</th>; }
function Td({ children, hl }) { return <td style={{ padding:'6px 9px',borderBottom:`1px solid ${C.border}`,fontWeight:hl?700:'normal' }}>{children}</td>; }

export default function PlayerView({ player: initPlayer, team, onLogout }) {
  const [player, setPlayer] = useState(initPlayer);
  const [tab, setTab] = useState('engine');
  const [checkins, setCheckins] = useState([]);
  const [games, setGames] = useState([]);
  const [liftLogs, setLiftLogs] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Engine state
  const [rSleep, setRSleep] = useState(0);
  const [rSore, setRSore] = useState(0);
  const [rInj, setRInj] = useState(0);
  const [rEnergy, setREnergy] = useState(0);
  const [rPrev, setRPrev] = useState(0);
  const [rHard, setRHard] = useState(0);
  const [decision, setDecision] = useState(null);

  // Check-in form
  const [ciForm, setCiForm] = useState({ weight_lbs:'',sprint_40m:'',bench_lbs:'',sleep_avg:'',energy_avg:'',soreness_avg:'',days_completed:'' });
  const [ciSaving, setCiSaving] = useState(false);
  const [ciMsg, setCiMsg] = useState('');

  // Game form
  const [gForm, setGForm] = useState({});
  const [gSaving, setGSaving] = useState(false);

  // Lift form
  const [lForm, setLForm] = useState({});
  const [lSaving, setLSaving] = useState(false);

  const pos = POSITIONS[player.position] || POSITIONS.striker;
  const gym = GYM_FOCUSES[player.gym_focus] || GYM_FOCUSES.hypertrophy;
  const nutrition = calcNutrition(player);
  const latestCI = checkins[0];
  const scoreData = calcScore(player, latestCI, games);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const [{ data: cis }, { data: gs }, { data: ls }, { data: ms }] = await Promise.all([
      getCheckins(player.id), getGames(player.id), getLiftLogs(player.id), getMeasurements(player.id)
    ]);
    setCheckins(cis || []);
    setGames(gs || []);
    setLiftLogs(ls || []);
    setMeasurements(ms || []);
    setLoading(false);
  }

  function calcDecision() {
    let type, title, items;
    if (rInj === 2) {
      type='red'; title='🛑 Injury Protocol Active';
      items=['Replace sprint → Stationary bike 20 min','Upper body only — no leg loading','Achilles armor protocol mandatory','Extra 500 cal for tissue repair','9+ hrs sleep tonight'];
    } else if (rHard >= 4 || rSleep <= 5 || rSore >= 9 || (rPrev===2&&rSore>=7)) {
      type='red'; title='🔴 Recovery Day';
      items=['Solo Leveling lite (50%) only','15-min easy walk — zero intensity','Foam roll + full stretch 20 min','Full calories — recovery needs fuel','9+ hrs sleep tonight'];
    } else if (rHard >= 3 || rSleep === 6 || rSore >= 6 || rEnergy === 2) {
      type='amber'; title='🟡 Reduce Intensity 30%';
      items=['Gym at 70% weights, 2 sets per exercise','Skip arm finisher — add to next session','No max-effort sprints — tempo only','Prioritize 8+ hrs sleep tonight'];
    } else {
      type='green'; title='🟢 Full Training';
      items=['Execute today\'s session at full intensity','Arm finisher mandatory — log weight and reps',`${pos.label}-specific: ${pos.sprintFocus}`,'Post-session finishing protocol if applicable'];
    }
    setDecision({ type, title, items });
  }

  async function submitCheckin() {
    setCiSaving(true);
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - weekDate.getDay()); // Sunday of this week
    const dateStr = weekDate.toISOString().split('T')[0];

    // Auto-adjust logic
    const prev = checkins[0];
    const adjs = [];
    let calTarget = nutrition.calories;
    if (prev?.weight_lbs && ciForm.weight_lbs) {
      const diff = parseFloat(ciForm.weight_lbs) - prev.weight_lbs;
      if (diff < 0.2 && player.body_goal === 'gain') { calTarget += 300; adjs.push({ t:'Weight stalled', d:`Add +300 cal/day → target ${calTarget}` }); }
      else if (diff < 0) { calTarget += 500; adjs.push({ t:'Losing weight', d:`Urgently increase to ${calTarget} cal/day` }); }
    }
    if (ciForm.sleep_avg < 6.5) adjs.push({ t:'Sleep insufficient', d:'Drop intensity 30% until avg sleep returns to 7.5+' });
    if (ciForm.days_completed <= 3) adjs.push({ t:'Low compliance', d:'Reset to last week volume. Do not catch up.' });
    if (ciForm.energy_avg >= 8) adjs.push({ t:'High energy', d:'Push for PRs this week. Add extra arm set.' });

    const { data } = await saveCheckin(player.id, { week_date: dateStr, ...ciForm, cal_target: calTarget, adjustments: adjs });
    if (data) {
      setCheckins([data, ...checkins]);
      setCiMsg('Saved! ' + (adjs.length ? `${adjs.length} adjustment${adjs.length>1?'s':''} generated.` : 'No adjustments needed — keep going.'));
    }
    setCiSaving(false);
  }

  async function submitGame() {
    setGSaving(true);
    const stats = {};
    pos.gameStats.forEach(k => { if (gForm[k] !== undefined && gForm[k] !== '') stats[k] = parseFloat(gForm[k]) || 0; });
    const { data } = await saveGame(player.id, { game_date: gForm.date || new Date().toISOString().split('T')[0], opponent: gForm.opponent, minutes_played: parseInt(gForm.minutes) || 90, stats, self_rating: parseInt(gForm.self_rating) || null, run_worked: gForm.run_worked, notes: gForm.notes });
    if (data) setGames([data, ...games]);
    setGForm({});
    setGSaving(false);
  }

  const ARM_LIFTS = ['Barbell curl','Skull crushers','Cable curls','Hammer curls','Rope pushdowns'];
  async function submitLifts() {
    setLSaving(true);
    const rows = ARM_LIFTS.map((ex,i) => ({ exercise:ex, weight_lbs:parseFloat(lForm['w'+i])||null, reps:parseInt(lForm['r'+i])||null })).filter(r=>r.weight_lbs&&r.reps);
    if (rows.length) { const { data } = await saveLiftLog(player.id, rows); if(data) setLiftLogs([...data,...liftLogs]); }
    setLForm({});
    setLSaving(false);
  }

  const TABS = ['engine','training','sprint','gym','nutrition','game','checkin','progress'];
  const TAB_LABELS = { engine:'🧠 Engine', training:'Training', sprint:'Sprint', gym:'Gym + Arms', nutrition:'Nutrition', game:'Game Log', checkin:'Check-In', progress:'Progress' };

  const colorMap = { red: [C.redLt, C.red, '#7A1F1F'], amber: [C.amberLt, C.amber, C.amber], green: [C.tealLt, C.teal, C.tealDk] };

  return (
    <div style={{ background:C.bg, minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0F2D4A,#083A5E,#0A5A8A)', color:'white', padding:'1.25rem 1.75rem 1rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
          <div>
            <h1 style={{ fontSize:18,fontWeight:800,margin:0 }}>{player.name}</h1>
            <p style={{ fontSize:11,opacity:.7,margin:'3px 0 0' }}>Athlete OS · {team.name}</p>
          </div>
          <button onClick={onLogout} style={{ padding:'6px 14px',borderRadius:8,border:'1px solid rgba(255,255,255,.3)',background:'transparent',color:'white',fontSize:12,cursor:'pointer' }}>Logout</button>
        </div>
        {/* Identity bar */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6,marginTop:12 }}>
          {[
            [latestCI?.weight_lbs||player.weight_lbs||'—','Weight','lbs'],
            [latestCI?.sprint_40m||player.sprint_40m||'—','40m Sprint','s'],
            [latestCI?.bench_lbs||player.bench_lbs||'—','Bench','lbs'],
            [scoreData.total,'Score',''],
            [pos.emoji+' '+pos.label,'Position',''],
          ].map(([val,lbl,unit])=>(
            <div key={lbl} style={{ textAlign:'center',background:'rgba(255,255,255,.1)',borderRadius:8,padding:'6px 4px' }}>
              <div style={{ fontSize:15,fontWeight:800,color:'white' }}>{val}{unit&&val!=='—'?unit:''}</div>
              <div style={{ fontSize:9,opacity:.55 }}>{lbl}</div>
            </div>
          ))}
        </div>
        {/* Badges */}
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginTop:8 }}>
          <span style={{ fontSize:10,padding:'2px 9px',borderRadius:20,fontWeight:700,background:`rgba(255,255,255,.15)`,color:'rgba(255,255,255,.85)' }}>{pos.emoji} {pos.label}</span>
          <span style={{ fontSize:10,padding:'2px 9px',borderRadius:20,fontWeight:700,background:`rgba(255,255,255,.15)`,color:'rgba(255,255,255,.85)' }}>{gym.label}</span>
          <span style={{ fontSize:10,padding:'2px 9px',borderRadius:20,fontWeight:700,background:`rgba(255,255,255,.15)`,color:'rgba(255,255,255,.85)' }}>{BODY_GOALS[player.body_goal]?.label}</span>
          {player.coach_focus && <span style={{ fontSize:10,padding:'2px 9px',borderRadius:20,fontWeight:700,background:'rgba(29,158,117,.35)',color:'#9efcd9' }}>📌 {player.coach_focus}</span>}
          {player.is_injured && <span style={{ fontSize:10,padding:'2px 9px',borderRadius:20,fontWeight:700,background:'rgba(226,75,74,.35)',color:'#ffd0cf' }}>🩹 Injured</span>}
        </div>
        {player.coach_note && <div style={{ marginTop:8,padding:'6px 10px',background:'rgba(255,255,255,.1)',borderRadius:8,fontSize:12,opacity:.9 }}>📋 Coach: {player.coach_note}</div>}
      </div>

      {/* Nav */}
      <div style={{ display:'flex',gap:4,padding:'.625rem 1.25rem',background:'white',borderBottom:`1px solid ${C.border}`,flexWrap:'wrap',position:'sticky',top:0,zIndex:100 }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'5px 11px',borderRadius:20,border:`1px solid ${tab===t?C.blue:C.border}`,background:tab===t?C.blue:'white',color:tab===t?'white':C.muted,cursor:'pointer',fontSize:11,fontWeight:500,whiteSpace:'nowrap' }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={{ padding:'1.25rem',maxWidth:1100,margin:'0 auto' }}>

        {/* ══ ENGINE ══ */}
        {tab==='engine' && <>
          <Sh>Daily Readiness — What Should I Do Today?</Sh>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
            <div>
              {[
                ['Sleep last night?', [['8+ hrs',8,'teal'],['7 hrs',7,'teal'],['6 hrs',6,'amber'],['≤5 hrs',5,'red']], rSleep, setRSleep],
                ['Soreness?', [['None/Fresh',1,'teal'],['Mild (1-4)',4,'teal'],['Moderate (5-6)',6,'amber'],['Heavy (7-8)',8,'amber'],['Pain 9-10',10,'red']], rSore, setRSore],
                ['Injury?', [['No injury',0,'teal'],['Minor',1,'amber'],['Active ankle injury',2,'red']], rInj, setRInj],
                ['Energy?', [['High',3,'teal'],['Moderate',2,'amber'],['Low',1,'red']], rEnergy, setREnergy],
                ['Yesterday was?', [['Rest/Easy',0,'teal'],['Moderate',1,'amber'],['Intense',2,'red']], rPrev, setRPrev],
                ['Hard sessions this week?', [['0',0,'teal'],['1',1,'teal'],['2',2,'amber'],['3',3,'amber'],['4+',4,'red']], rHard, setRHard],
              ].map(([label,opts,val,setter])=>(
                <Card key={label} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:12,fontWeight:700,marginBottom:8 }}>{label}</div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                    {opts.map(([lbl,v,col])=>{
                      const sel = val===v;
                      const bg = sel ? (col==='teal'?C.teal:col==='amber'?C.amber:C.red) : 'white';
                      return <button key={lbl} onClick={()=>setter(v)} style={{ padding:'4px 10px',borderRadius:20,border:`1px solid ${sel?(col==='teal'?C.teal:col==='amber'?C.amber:C.red):C.border}`,background:bg,color:sel?'white':C.muted,fontSize:11,cursor:'pointer',fontWeight:sel?700:400 }}>{lbl}</button>;
                    })}
                  </div>
                </Card>
              ))}
              <button onClick={calcDecision} style={{ width:'100%',padding:11,borderRadius:10,border:'none',background:C.blue,color:'white',fontSize:13,fontWeight:700,cursor:'pointer' }}>→ Get Today's Decision</button>
            </div>
            <div>
              {decision && (()=>{
                const [bg,brd,clr] = colorMap[decision.type];
                return <div style={{ background:bg,border:`2px solid ${brd}`,borderRadius:10,padding:'1rem 1.25rem' }}>
                  <div style={{ fontSize:14,fontWeight:700,color:clr,marginBottom:8 }}>{decision.title}</div>
                  <ul style={{ paddingLeft:'1rem',lineHeight:2.1,fontSize:13,color:clr }}>
                    {decision.items.map(i=><li key={i}>{i}</li>)}
                  </ul>
                </div>;
              })()}
              <Sh>Hard Cap Rules</Sh>
              <Card>
                <div style={{ fontSize:12,color:C.red,fontWeight:700,marginBottom:6 }}>Max 4 HIGH intensity days/week</div>
                <div style={{ fontSize:12,color:C.muted,lineHeight:1.8 }}>
                  Sprint sessions ≤ 2/week · Arm finisher sessions ≤ 4/week · Total sessions ≤ 6/week<br/>
                  Deload weeks: 4, 8, 12 — 60% weights, no PRs
                </div>
              </Card>
              <Sh>Your Position Focus</Sh>
              <Card>
                <div style={{ display:'flex',gap:12,alignItems:'center',marginBottom:10 }}>
                  <div style={{ fontSize:32 }}>{pos.emoji}</div>
                  <div>
                    <div style={{ fontSize:15,fontWeight:700 }}>{pos.label}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{pos.tagline}</div>
                  </div>
                </div>
                {[['Sprint',pos.sprintFocus],['Strength',pos.strengthFocus],['Endurance',pos.enduranceFocus],['Agility',pos.agilityFocus]].map(([k,v])=>(
                  <div key={k} style={{ display:'flex',gap:6,padding:'4px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12 }}>
                    <span style={{ fontWeight:700,color:C.muted,minWidth:72 }}>{k}:</span><span>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </>}

        {/* ══ TRAINING ══ */}
        {tab==='training' && <>
          <Sh>12-Week Phase Schedule</Sh>
          <TblWrap>
            <thead><tr><Th>Week</Th><Th>Theme</Th><Th>Primary Focus</Th></tr></thead>
            <tbody>{pos.weeklyThemes.map((theme,i)=>(
              <tr key={i} style={{ background:theme==='DELOAD'?C.amberLt:i%2===0?C.bg:'white' }}>
                <Td hl>{i+1}{theme==='DELOAD'?'':`${'·'.repeat(0)}`}</Td>
                <Td hl>{theme}</Td>
                <Td>{theme==='DELOAD'?'60% weights · No PRs · 9hrs sleep · Recovery only':`${pos.label}-specific training emphasis`}</Td>
              </tr>
            ))}</tbody>
          </TblWrap>
          <Sh>Weekly Schedule</Sh>
          <Card>
            {[
              ['MON','FULL','Conditioning + Achilles armor + Arm finisher'],
              ['TUE','FULL','GYM: Push Day + Arm Finisher + Band external rotations'],
              ['WED','LITE','Week A: Tempo + Agility · Week B: TRUE LOW DAY'],
              ['THU','FULL','GYM: Pull Day + Arm Finisher + Band external rotations'],
              ['FRI','FULL','GYM: Legs + Full Arm Session'],
              ['SAT','LITE','★ MAIN SPRINT/TRACK DAY (position-specific protocol)'],
              ['SUN','LITE','Easy run (optional) + Weekly Check-In + Meal prep'],
            ].map(([day,sl,desc])=>(
              <div key={day} style={{ display:'flex',gap:12,alignItems:'flex-start',padding:'8px 0',borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:32,height:28,borderRadius:'50%',background:day==='SAT'?'#FAC775':sl==='FULL'?C.blueLt:C.bg,color:day==='SAT'?'#633806':sl==='FULL'?C.blueDk:C.muted,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,flexShrink:0,marginTop:2 }}>{day}</div>
                <div>
                  <div style={{ fontSize:12,fontWeight:700 }}>{desc}</div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>Solo Leveling: {sl==='FULL'?'Full (100 reps)':'Lite (50 reps)'}</div>
                </div>
              </div>
            ))}
          </Card>
          <Sh>Deload Protocol</Sh>
          <Card>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:12 }}>
              <div><div style={{ fontWeight:700,marginBottom:6 }}>What changes</div><ul style={{ paddingLeft:'1rem',lineHeight:2,color:C.muted }}><li>60% of normal weights</li><li>2 sets per exercise only</li><li>No arm finishers</li><li>No sprint PR attempts</li><li>Wednesday = full low day</li></ul></div>
              <div><div style={{ fontWeight:700,marginBottom:6 }}>What stays</div><ul style={{ paddingLeft:'1rem',lineHeight:2,color:C.muted }}><li>Solo Leveling lite daily</li><li>Achilles armor 3×/week</li><li>Full nutrition</li><li>9 hrs sleep nightly</li><li>Visualization</li></ul></div>
            </div>
            <Hbox color="green">Deload is NOT a break. It's where adaptation locks in. You'll come back noticeably stronger.</Hbox>
          </Card>
        </>}

        {/* ══ SPRINT ══ */}
        {tab==='sprint' && <>
          <Card style={{ borderColor:C.red, background:C.redLt }}>
            <div style={{ fontSize:12,color:'#7A1F1F',fontWeight:700 }}>🩹 Ankle recovery: no spike sessions until pain-free jogging 5+ consecutive days. Quality rule: if any sprint drops &gt;5% → cut remaining volume.</div>
          </Card>
          <Sh>{pos.label} Sprint Protocol</Sh>
          {pos.sprintSessions.map(session=>(
            <div key={session.phase}>
              <Sh>{session.phase}</Sh>
              <TblWrap>
                <thead><tr><Th>Distance</Th><Th>Sets</Th><Th>Effort</Th><Th>Rest</Th></tr></thead>
                <tbody>{session.reps.map((r,i)=>(
                  <tr key={i} style={{ background:i%2===0?C.bg:'white' }}>
                    <Td hl>{r.dist}</Td><Td>{r.sets}</Td><Td>{r.effort}</Td><Td>{r.rest}</Td>
                  </tr>
                ))}</tbody>
              </TblWrap>
            </div>
          ))}
          <Sh>Sprint Phase Progression</Sh>
          <TblWrap>
            <thead><tr><Th>Phase</Th><Th>Weeks</Th><Th>Focus</Th></tr></thead>
            <tbody>
              <tr style={{ background:C.bg }}><Td hl>1 — Technique</Td><Td>1–4</Td><Td>Mechanics, acceleration, drive phase</Td></tr>
              <tr><Td hl>2 — Max Velocity</Td><Td>5–8</Td><Td>Top-end speed + plyometrics added</Td></tr>
              <tr style={{ background:C.bg }}><Td hl>3 — Game Endurance</Td><Td>9–12</Td><Td>Repeat sprint ability, late-game speed</Td></tr>
            </tbody>
          </TblWrap>
          <Sh>Ankle Return-to-Play Ladder</Sh>
          <TblWrap>
            <thead><tr><Th>Stage</Th><Th>Activity</Th><Th>Pass Condition</Th></tr></thead>
            <tbody>{[
              ['1 — Walking','Normal walking, Achilles armor daily','Full day zero pain'],
              ['2 — Light jog','Easy jog 5–10 min','30-min jog no pain'],
              ['3 — Strides 60%','4×50m strides flat shoes','All pain-free, no limp'],
              ['4 — Strides 80%','4×60m at 80%, agility at 50%','Ankle symmetric'],
              ['5 — First sprint','2×30m + 2×60m in spikes, no dead legs','Within 10% of pre-injury'],
              ['6 — Full protocol','Complete Saturday session','You are back'],
            ].map(([s,a,p],i)=>(
              <tr key={i} style={{ background:i%2===0?C.bg:'white' }}><Td hl>{s}</Td><Td>{a}</Td><Td>{p}</Td></tr>
            ))}</tbody>
          </TblWrap>
        </>}

        {/* ══ GYM ══ */}
        {tab==='gym' && <>
          <Hbox color="blue">Overload: +5 lbs OR 1–2 more reps every session. Shoulder protection: Band external rotations 2×15 every push + pull day.</Hbox>
          <div style={{ background:C.purpleLt,borderLeft:`3px solid ${C.purple}`,color:C.purple,borderRadius:'0 6px 6px 0',padding:'7px 11px',marginTop:8,fontSize:12,lineHeight:1.6,marginBottom:'1rem' }}>
            Gym style: <strong>{gym.label}</strong> — {gym.sets} sets × {gym.reps} reps · {gym.rest} rest · {gym.emphasis}
          </div>
          {[
            ['Tuesday — Push + Arm Finisher',[
              ['Barbell bench press','4×6–8','2/1/2','Main chest mass'],
              ['Incline DB press','3×8–10','2/1/2','Upper chest'],
              ['Overhead press','3×6–8','2/1/2','Shoulder width'],
              ['Lateral raises','4×12–15','2/0/2','Frame width'],
              ['OHT extension','3×10–12','2/1/2','Long head'],
              ['Tricep pushdowns','3×12–15','Ctrl','Pump finisher'],
              ['ARM FINISHER','','',''],
              ['Cable curls','3×12','2/0/2','Peak — constant tension'],
              ['Rope pushdowns','3×15','Ctrl','Lateral head'],
              ['Band ext. rotations','2×15','Ctrl','Shoulder protection'],
            ]],
            ['Thursday — Pull + Arm Finisher',[
              ['Pull-ups (weighted)','4×6–10','2/0/3','Width + thickness'],
              ['Barbell rows','4×8–10','2/1/2','Mid-back density'],
              ['Lat pulldown','3×10–12','2/1/2','Full stretch'],
              ['Face pulls','3×15','Ctrl','Rear delts'],
              ['Barbell curl','4×8–10','2/0/2','Primary — track this'],
              ['ARM FINISHER','','',''],
              ['Hammer curls','3×12','Ctrl','Brachialis thickness'],
              ['Preacher curls','3×10–12','2/1/2','Isolate'],
              ['Overhead tricep ext.','3×12','2/1/2','Long head'],
              ['Band ext. rotations','2×15','Ctrl','Shoulder protection'],
            ]],
            ['Friday — Legs + Full Arms',[
              ['Barbell back squats','4×6–8','3/1/2','Sprint power'],
              ['Romanian deadlifts','3×8–10','3/0/1','Hamstrings + glutes'],
              ['Bulgarian split squats','3×10 each','2/1/2','Single-leg stability'],
              ['Leg curl','3×12','2/1/2','Hamstring isolation'],
              ['Calf raises (slow)','4×15–20','3/1/3','Achilles strength'],
              ['PRIMARY ARM LIFTS','','',''],
              ['Close-grip bench','3×8–10','2/1/2','Tricep mass — log this'],
              ['Skull crushers','3×10–12','2/0/2','Long head — log this'],
              ['Bicep 21s','3 sets','Ctrl','7 low/7 high/7 full'],
              ['Cable curls','3×12','2/0/2','Constant tension'],
              ['Rope pushdowns','3×15','Ctrl','Lateral head pump'],
            ]],
          ].map(([title,rows])=>(
            <div key={title}>
              <Sh>{title}</Sh>
              <TblWrap>
                <thead><tr><Th>Exercise</Th><Th>Sets × Reps</Th><Th>Tempo</Th><Th>Focus</Th></tr></thead>
                <tbody>{rows.map((r,i)=>{
                  const isHeader = !r[1];
                  return <tr key={i} style={{ background:isHeader?C.blueLt:i%2===0?C.bg:'white' }}>
                    <Td hl>{r[0]}</Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td>{r[3]}</Td>
                  </tr>;
                })}</tbody>
              </TblWrap>
            </div>
          ))}
          <Sh>Arm Lift Log — Track Performance</Sh>
          <Card>
            {ARM_LIFTS.map((ex,i)=>{
              const last = liftLogs.filter(l=>l.exercise===ex)[0];
              return <div key={i} style={{ display:'grid',gridTemplateColumns:'140px 80px 60px 1fr',gap:8,alignItems:'center',marginBottom:6,fontSize:12 }}>
                <span style={{ fontWeight:600 }}>{ex}</span>
                <input type="number" placeholder={last?last.weight_lbs:'lbs'} value={lForm['w'+i]||''} onChange={e=>setLForm(f=>({...f,['w'+i]:e.target.value}))} style={{ padding:'4px 6px',borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,textAlign:'center' }}/>
                <input type="number" placeholder={last?last.reps:'reps'} value={lForm['r'+i]||''} onChange={e=>setLForm(f=>({...f,['r'+i]:e.target.value}))} style={{ padding:'4px 6px',borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,textAlign:'center' }}/>
                <span style={{ fontSize:11,color:C.muted }}>{last?`Last: ${last.weight_lbs}lbs × ${last.reps}`:'No log yet'}</span>
              </div>;
            })}
            <button onClick={submitLifts} disabled={lSaving} style={{ padding:'6px 14px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer',marginTop:4 }}>{lSaving?'Saving...':'Save Lift Log'}</button>
          </Card>
        </>}

        {/* ══ NUTRITION ══ */}
        {tab==='nutrition' && <>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:'1rem' }}>
            {[['Calories',nutrition.calories,'cal'],[`Protein`,nutrition.protein,'g'],['Carbs',nutrition.carbs,'g'],['Fats',nutrition.fat,'g']].map(([l,v,u])=>(
              <Card key={l} style={{ textAlign:'center',padding:'.875rem',marginBottom:0 }}>
                <div style={{ fontSize:22,fontWeight:800,color:C.blue }}>{v}</div>
                <div style={{ fontSize:11,color:C.muted }}>{l} {u}</div>
              </Card>
            ))}
          </div>
          <Hbox color="amber">{pos.carbTiming}</Hbox>
          <Hbox color="blue">{nutrition.note}</Hbox>
          <Sh>Daily Meal Plan</Sh>
          <TblWrap>
            <thead><tr><Th>Meal</Th><Th>Timing</Th><Th>Food</Th><Th>Macros</Th></tr></thead>
            <tbody>{[
              ['Breakfast','After AM routine','3–4 eggs + 1 cup oats + banana + coffee','~50P · 80C · 15F'],
              ['Pre-workout','30–60 min before','Greek yogurt + granola + apple','~20P · 50C · 5F'],
              ['Post-workout','Within 30 min','1.5 cups rice + 6oz chicken + veggies','~55P · 90C · 8F'],
              ['Lunch','Midday','Chicken/tuna wrap + fruit + water','~40P · 60C · 10F'],
              ['Afternoon','3–4 PM','Peanut butter + bread + milk/shake','~25P · 40C · 15F'],
              ['Dinner','Evening','Ground beef + potatoes/pasta + salad','~50P · 80C · 20F'],
              ['Before bed','30–60 min prior','Cottage cheese or casein shake','~25P · 10C · 5F'],
            ].map(([m,t,f,macro],i)=>(
              <tr key={i} style={{ background:i%2===0?C.bg:'white' }}><Td hl>{m}</Td><Td>{t}</Td><Td>{f}</Td><Td>{macro}</Td></tr>
            ))}</tbody>
          </TblWrap>
          <Sh>Check-In Adjustments</Sh>
          {checkins[0]?.adjustments?.length ? checkins[0].adjustments.map((a,i)=>(
            <div key={i} style={{ background:C.amberLt,border:`1px solid ${C.amber}`,borderRadius:8,padding:'8px 11px',marginBottom:6,fontSize:12 }}>
              <div style={{ fontWeight:700 }}>{a.t}</div><div style={{ color:C.muted,marginTop:2 }}>{a.d}</div>
            </div>
          )) : <div style={{ color:C.muted,fontSize:13 }}>Complete a check-in to unlock adaptive nutrition adjustments.</div>}
        </>}

        {/* ══ GAME LOG ══ */}
        {tab==='game' && <>
          <Sh>Log a Game</Sh>
          <Card>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8 }}>
              <Inp label="Date" type="date" value={gForm.date||''} onChange={e=>setGForm(f=>({...f,date:e.target.value}))}/>
              <Inp label="Opponent" placeholder="e.g. FC Rivals" value={gForm.opponent||''} onChange={e=>setGForm(f=>({...f,opponent:e.target.value}))}/>
              <Inp label="Minutes played" type="number" placeholder="90" value={gForm.minutes||''} onChange={e=>setGForm(f=>({...f,minutes:e.target.value}))}/>
            </div>
            <div style={{ fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:'uppercase',letterSpacing:'.6px' }}>{pos.label} Stats</div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8,marginBottom:12 }}>
              {pos.gameStats.map(k=>(
                <Inp key={k} label={pos.gameStatLabels[k]} type="number" min="0" placeholder="0" value={gForm[k]||''} onChange={e=>setGForm(f=>({...f,[k]:e.target.value}))}/>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8 }}>
              <Inp label="Self-rating (1–10)" type="number" min="1" max="10" placeholder="7" value={gForm.self_rating||''} onChange={e=>setGForm(f=>({...f,self_rating:e.target.value}))}/>
              <Inp label="Run/tactic that worked" placeholder="e.g. Spin behind" value={gForm.run_worked||''} onChange={e=>setGForm(f=>({...f,run_worked:e.target.value}))}/>
            </div>
            <Inp label="Notes (one worked / one to fix)" placeholder="e.g. Press angles sharp / late-game energy dropped" value={gForm.notes||''} onChange={e=>setGForm(f=>({...f,notes:e.target.value}))}/>
            <button onClick={submitGame} disabled={gSaving} style={{ padding:'7px 18px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer' }}>{gSaving?'Saving...':'Save Game →'}</button>
          </Card>
          <Sh>Game History</Sh>
          {games.length === 0 ? <div style={{ color:C.muted,fontSize:13 }}>No games logged yet.</div> : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>
                <thead><tr>{['Date','Opponent','Mins',...pos.gameStats.map(k=>pos.gameStatLabels[k]),'Rating','Run'].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>{games.map((g,i)=>(
                  <tr key={g.id} style={{ background:i%2===0?C.bg:'white' }}>
                    <Td>{g.game_date}</Td><Td>{g.opponent||'—'}</Td><Td>{g.minutes_played}'</Td>
                    {pos.gameStats.map(k=><Td key={k} hl={k==='goals'||k==='saves'}>{g.stats?.[k]??'—'}</Td>)}
                    <Td><span style={{ fontWeight:700,color:g.self_rating>=8?C.teal:g.self_rating>=6?C.amber:C.red }}>{g.self_rating||'—'}</span></Td>
                    <Td>{g.run_worked||'—'}</Td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </>}

        {/* ══ CHECK-IN ══ */}
        {tab==='checkin' && <>
          <Sh>Sunday Weekly Check-In</Sh>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
            <Card>
              <div style={{ display:'grid',gap:6 }}>
                <Inp label="Weight (lbs)" type="number" placeholder="e.g. 172" value={ciForm.weight_lbs} onChange={e=>setCiForm(f=>({...f,weight_lbs:e.target.value}))}/>
                <Inp label="Best 40m sprint (s)" type="number" step="0.01" placeholder="e.g. 4.9" value={ciForm.sprint_40m} onChange={e=>setCiForm(f=>({...f,sprint_40m:e.target.value}))}/>
                <Inp label="Best bench press (lbs)" type="number" placeholder="e.g. 165" value={ciForm.bench_lbs} onChange={e=>setCiForm(f=>({...f,bench_lbs:e.target.value}))}/>
                <Inp label="Avg sleep (hrs/night)" type="number" step="0.5" placeholder="e.g. 7.5" value={ciForm.sleep_avg} onChange={e=>setCiForm(f=>({...f,sleep_avg:e.target.value}))}/>
                <Inp label="Overall energy (1–10)" type="number" min="1" max="10" placeholder="e.g. 7" value={ciForm.energy_avg} onChange={e=>setCiForm(f=>({...f,energy_avg:e.target.value}))}/>
                <Inp label="Avg soreness (1–10)" type="number" min="1" max="10" placeholder="e.g. 4" value={ciForm.soreness_avg} onChange={e=>setCiForm(f=>({...f,soreness_avg:e.target.value}))}/>
                <Inp label="Days completed" type="number" min="0" max="7" placeholder="e.g. 6" value={ciForm.days_completed} onChange={e=>setCiForm(f=>({...f,days_completed:e.target.value}))}/>
                <button onClick={submitCheckin} disabled={ciSaving} style={{ padding:'8px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer' }}>{ciSaving?'Saving...':'Save Check-In →'}</button>
                {ciMsg && <div style={{ fontSize:12,color:C.tealDk,fontWeight:600,padding:'6px 8px',background:C.tealLt,borderRadius:8 }}>{ciMsg}</div>}
              </div>
            </Card>
            <Card>
              <div style={{ fontSize:12,fontWeight:700,marginBottom:8 }}>Check-In History</div>
              {checkins.length===0 ? <div style={{ color:C.muted,fontSize:12 }}>No check-ins yet.</div> : (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(75px,1fr))',gap:6 }}>
                  {checkins.slice(0,8).map(ci=>(
                    <div key={ci.id} style={{ background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px',textAlign:'center' }}>
                      <div style={{ fontSize:10,color:C.muted }}>{ci.week_date}</div>
                      {ci.weight_lbs&&<div style={{ fontSize:12,fontWeight:700 }}>{ci.weight_lbs}</div>}
                      {ci.sprint_40m&&<div style={{ fontSize:11,color:C.muted }}>{ci.sprint_40m}s</div>}
                      <div style={{ fontSize:11,color:ci.days_completed>=5?C.teal:C.amber }}>{ci.days_completed}/7d</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>}

        {/* ══ PROGRESS ══ */}
        {tab==='progress' && <>
          <Sh>Superhuman Score</Sh>
          <Card>
            <div style={{ display:'grid',gridTemplateColumns:'100px 1fr',gap:'1rem',alignItems:'center' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ width:80,height:80,borderRadius:'50%',border:`4px solid ${scoreData.total>=80?C.teal:scoreData.total>=60?C.amber:C.red}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:scoreData.total>=80?C.teal:scoreData.total>=60?C.amber:C.red,margin:'0 auto 6px' }}>{scoreData.total||'—'}</div>
                <div style={{ fontSize:11,fontWeight:700,color:C.muted }}>{scoreData.total>=80?'Elite':scoreData.total>=60?'Building':'Foundation'}</div>
              </div>
              <div>
                {[['Sprint',scoreData.sprint,C.blue],['Strength',scoreData.strength,C.teal],['Consistency',scoreData.consistency,C.amber],['Soccer',scoreData.soccer,'#5B3FA8']].map(([l,v,c])=>(
                  <div key={l} style={{ marginBottom:8 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2 }}><span>{l}</span><span style={{ fontWeight:700 }}>{v??'—'}%</span></div>
                    <Bar value={v} color={c}/>
                  </div>
                ))}
                {!scoreData.hasSoccer && <div style={{ fontSize:11,color:C.muted,marginTop:4 }}>Log 2+ games to unlock Soccer score</div>}
              </div>
            </div>
          </Card>
          <Sh>Measurements Log</Sh>
          <Card>
            <TblWrap>
              <thead><tr><Th>Measurement</Th><Th>Wk 1</Th><Th>Wk 4</Th><Th>Wk 8</Th><Th>Wk 12</Th></tr></thead>
              <tbody>{[['Weight (lbs)','mw'],['Arm (in, unflexed)','ma'],['40m sprint (s)','ms'],['Bench (lbs)','mb'],['Vertical (in)','mv']].map(([l,k])=>(
                <tr key={k}><Td hl>{l}</Td>{[1,4,8,12].map(w=>{
                  const m = measurements.find(m=>m.measured_at===`${new Date().getFullYear()}-W${String(w).padStart(2,'0')}`);
                  return <Td key={w}><input type="number" defaultValue={m?.[k.replace('m','')+k.slice(1)]||''} style={{ width:65,padding:'3px 5px',borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,textAlign:'center' }}/></Td>;
                })}</tr>
              ))}</tbody>
            </TblWrap>
          </Card>
          <Sh>Performance KPIs — {pos.label}</Sh>
          <Card>
            {pos.kpis.map(kpi=>(
              <div key={kpi} style={{ display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12 }}>
                <span style={{ width:8,height:8,borderRadius:'50%',background:C.blue,display:'inline-block',flexShrink:0 }}></span>
                <span>{kpi}</span>
              </div>
            ))}
          </Card>
        </>}

      </div>
    </div>
  );
}
