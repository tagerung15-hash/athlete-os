// src/views/PlayerView.jsx — v4
import { useState, useEffect } from 'react';
import { getCheckins, saveCheckin, getGames, saveGame, getMeasurements, updatePlayer, supabase, getUpcomingEvents, respondToEvent, getPlayerAttendanceForEvents } from '../lib/supabase';
import { POSITIONS, PERFORMANCE_FOCUS, calcNutrition, calcScore, buildGymPlan } from '../lib/config';
import TacticsView from './TacticsView';
import LineupView from './LineupView';
import ScheduleView from './ScheduleView';

const C = {
  bg:'#F8F8F6',card:'#fff',border:'#E0DED7',text:'#18181A',muted:'#6B6A66',
  teal:'#1D9E75',tealDk:'#085041',tealLt:'#E1F5EE',
  blue:'#185FA5',blueDk:'#0C447C',blueLt:'#E6F1FB',
  amber:'#BA7517',amberLt:'#FAEEDA',
  red:'#E24B4A',redLt:'#FCEBEB',
  purple:'#5B3FA8',purpleLt:'#EEEDFE',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function Hbox({color='green',children}) {
  const map={green:[C.tealLt,C.teal,C.tealDk],amber:[C.amberLt,C.amber,C.amber],blue:[C.blueLt,C.blue,C.blueDk],red:[C.redLt,C.red,'#7A1F1F'],purple:[C.purpleLt,C.purple,C.purple]};
  const [bg,brd,clr]=map[color]||map.green;
  return <div style={{background:bg,borderLeft:`3px solid ${brd}`,color:clr,borderRadius:'0 6px 6px 0',padding:'7px 11px',marginTop:8,fontSize:12,lineHeight:1.6}}>{children}</div>;
}
function Sh({children}) {
  return <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.8px',color:C.muted,margin:'1.2rem 0 .5rem',borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>{children}</div>;
}
function Card({children,style}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.1rem',marginBottom:'.75rem',...style}}>{children}</div>;
}
function Inp({label,...props}) {
  return <div style={{marginBottom:8}}>
    {label&&<label style={{fontSize:11,color:C.muted,display:'block',marginBottom:3}}>{label}</label>}
    <input style={{width:'100%',padding:'6px 9px',borderRadius:7,border:`1px solid ${C.border}`,fontSize:13,fontFamily:'inherit',background:'white'}} {...props}/>
  </div>;
}
function TblWrap({children}) {
  return <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>{children}</table></div>;
}
function Th({children}) { return <th style={{background:C.bg,padding:'7px 9px',textAlign:'left',fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,whiteSpace:'nowrap'}}>{children}</th>; }
function Td({children,hl}) { return <td style={{padding:'6px 9px',borderBottom:`1px solid ${C.border}`,fontWeight:hl?700:'normal',verticalAlign:'top'}}>{children}</td>; }

// ── IQ Quiz Component ─────────────────────────────────────────────────────────
function IQQuiz({scenarios,posColor}) {
  const [idx,setIdx]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [answered,setAnswered]=useState(null);
  const [done,setDone]=useState(false);
  if (!scenarios||scenarios.length===0) return null;
  function answer(sel) {
    if (answered!==null) return;
    setAnswered(sel);
    if (sel===scenarios[idx].best) setCorrect(c=>c+1);
  }
  function next() {
    if (idx+1>=scenarios.length){setDone(true);return;}
    setIdx(i=>i+1); setAnswered(null);
  }
  function reset(){setIdx(0);setCorrect(0);setAnswered(null);setDone(false);}
  if (done) {
    const pct=Math.round(correct/scenarios.length*100);
    return (
      <Card style={{textAlign:'center'}}>
        <div style={{fontSize:36,fontWeight:800,color:pct>=80?C.teal:pct>=60?C.amber:C.red}}>{pct}%</div>
        <div style={{fontSize:14,fontWeight:700,margin:'6px 0'}}>{correct}/{scenarios.length} correct — {pct>=80?'Elite decision making':'Keep studying'}</div>
        <button onClick={reset} style={{padding:'8px 20px',borderRadius:8,border:'none',background:posColor||C.blue,color:'white',fontSize:13,fontWeight:700,cursor:'pointer'}}>Retake</button>
      </Card>
    );
  }
  const q=scenarios[idx];
  return (
    <Card>
      <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6}}>SCENARIO {idx+1}/{scenarios.length} · {correct} correct so far</div>
      <p style={{fontSize:13,fontWeight:700,marginBottom:10,lineHeight:1.6}}>{q.q}</p>
      {q.opts.map((opt,i)=>{
        const isCorrect=i===q.best, isSelected=answered===i;
        let bg='white',brd=C.border,clr=C.text;
        if (answered!==null){
          if (isCorrect){bg=C.tealLt;brd=C.teal;clr=C.tealDk;}
          else if (isSelected){bg=C.redLt;brd=C.red;clr='#501313';}
        }
        return <button key={i} onClick={()=>answer(i)} disabled={answered!==null} style={{display:'block',width:'100%',textAlign:'left',padding:'9px 13px',marginBottom:5,borderRadius:8,border:`1px solid ${brd}`,background:bg,fontSize:12,cursor:answered===null?'pointer':'default',color:clr,fontWeight:isCorrect&&answered!==null?700:'normal'}}>{String.fromCharCode(65+i)}. {opt}</button>;
      })}
      {answered!==null&&(
        <>
          <div style={{background:answered===q.best?C.tealLt:C.redLt,border:`1px solid ${answered===q.best?C.teal:C.red}`,borderRadius:8,padding:'8px 12px',fontSize:12,marginTop:5,color:answered===q.best?C.tealDk:'#A32D2D',lineHeight:1.6}}>
            {answered===q.best?'✓ Correct — ':'✗ Incorrect. '}{q.fb}
          </div>
          <div style={{textAlign:'right',marginTop:8}}>
            <button onClick={next} style={{padding:'7px 18px',borderRadius:8,border:'none',background:C.blue,color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>
              {idx+1>=scenarios.length?'See Results':'Next →'}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

// ── Performance Radar ─────────────────────────────────────────────────────────
function PerformanceRadar({speed,endurance,strength,availability,matchImpact,attendance}) {
  const dims=[
    {label:'Speed',value:speed,color:C.blue,desc:'Based on 40m sprint time'},
    {label:'Endurance',value:endurance,color:C.teal,desc:'Based on training consistency'},
    {label:'Strength',value:strength,color:C.purple,desc:'Based on check-in data'},
    {label:'Availability',value:availability,color:C.amber,desc:'Injury-free training days'},
    {label:'Match Impact',value:matchImpact,color:C.red,desc:'Game log ratings + stats'},
    ...(attendance!==null?[{label:'Attendance',value:attendance,color:'#1D6FA5',desc:'Event confirmations vs total events'}]:[]),
  ];
  return (
    <div>
      {dims.map(d=>(
        <div key={d.label} style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
            <span style={{fontWeight:600}}>{d.label}</span>
            <span style={{fontWeight:800,color:d.color}}>{d.value??'—'}</span>
          </div>
          <div style={{background:'#e0ddd7',borderRadius:20,height:8,overflow:'hidden',border:`0.5px solid ${C.border}`}}>
            <div style={{width:`${Math.min(100,d.value||0)}%`,height:'100%',background:d.color,borderRadius:20,transition:'width .6s'}}/>
          </div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{d.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ── Injury Return Ladders ─────────────────────────────────────────────────────
const INJURY_LADDERS = {
  ankle: {
    label:'Ankle Sprain',
    stages:[
      {stage:'1 — Rest + Ice','activity':'No weight bearing. Ice 20 min every 2 hrs. Elevation.','pass':'Zero pain at rest for 24 hrs'},
      {stage:'2 — Walking','activity':'Normal walking, no limp. Achilles armor daily.','pass':'Full day walking zero pain'},
      {stage:'3 — Light jog','activity':'Easy jog 5–10 min on flat ground.','pass':'30-min jog pain-free'},
      {stage:'4 — Strides 60%','activity':'4×50m strides flat shoes, no spikes.','pass':'All pain-free, no limp'},
      {stage:'5 — Strides 80%','activity':'4×60m at 80% + agility at 50%.','pass':'Ankle symmetric to other side'},
      {stage:'6 — First sprint','activity':'2×30m + 2×60m in spikes, no dead legs.','pass':'Within 10% of pre-injury time'},
      {stage:'7 — Full return','activity':'Complete full training session.','pass':'You are back'},
    ]
  },
  hamstring: {
    label:'Hamstring Strain',
    stages:[
      {stage:'1 — Protect','activity':'No running. Gentle walking only. Ice + compression.','pass':'Zero pain walking for 48 hrs'},
      {stage:'2 — Light movement','activity':'Easy cycling 15 min, light stretching, no loading.','pass':'No pain during or after cycling'},
      {stage:'3 — Strength','activity':'Isometric hamstring holds, Nordic curl negatives, single-leg RDL (light).','pass':'No pain during exercises'},
      {stage:'4 — Jogging','activity':'Easy jog 10–15 min, stop if any tightness.','pass':'20-min jog pain-free'},
      {stage:'5 — Progressive running','activity':'Build to 70% speed over 4–6 sessions.','pass':'No compensation pattern, symmetric'},
      {stage:'6 — Speed work','activity':'Controlled sprint work 80–90%, no max effort.','pass':'Sprint feels normal, no tightness after'},
      {stage:'7 — Full return','activity':'Full training including maximal sprints.','pass':'Cleared by physio or pain-free for 5 sessions'},
    ]
  },
  knee: {
    label:'Knee (General)',
    stages:[
      {stage:'1 — Reduce load','activity':'No impact. Swimming or cycling only if pain-free.','pass':'Swelling reduced, pain below 3/10'},
      {stage:'2 — Stability work','activity':'Straight-leg raises, quad sets, calf raises. No squatting.','pass':'No pain during exercises'},
      {stage:'3 — Partial loading','activity':'Bodyweight squats, step-ups, leg press light.','pass':'No pain during or 24 hrs after'},
      {stage:'4 — Jogging','activity':'Easy jog 10 min, flat surface, monitor closely.','pass':'No swelling post-run'},
      {stage:'5 — Change of direction','activity':'Gradual cutting, no sharp movements yet.','pass':'Symmetric movement, no compensation'},
      {stage:'6 — Full loading','activity':'Plyometrics, jumps, full sprint work.','pass':'Equal strength and confidence both legs'},
      {stage:'7 — Full return','activity':'Full training and match availability.','pass':'Cleared by medical staff'},
    ]
  },
  groin: {
    label:'Groin Strain',
    stages:[
      {stage:'1 — Rest','activity':'No adductor loading. Ice + rest. No wide movements.','pass':'Zero pain walking normally'},
      {stage:'2 — Gentle mobility','activity':'Hip mobility work, light adductor squeezes with ball.','pass':'No pain during gentle exercises'},
      {stage:'3 — Strengthening','activity':'Copenhagen planks (modified), side-lying adduction, single-leg balance.','pass':'No pain during or after'},
      {stage:'4 — Jogging','activity':'Straight-line jogging 10–15 min.','pass':'No groin tightness during or after'},
      {stage:'5 — Lateral movement','activity':'Side shuffles, light cutting, gradual direction changes.','pass':'Symmetric range of motion'},
      {stage:'6 — Full speed','activity':'Sprint work, sharp cuts, kicking practice.','pass':'Full power kicks pain-free'},
      {stage:'7 — Full return','activity':'Full training participation.','pass':'No tightness or compensation'},
    ]
  },
  calf: {
    label:'Calf Strain',
    stages:[
      {stage:'1 — Protect','activity':'No pushing off. Crutches if needed. Ice + elevation.','pass':'Can walk without limp'},
      {stage:'2 — Gentle loading','activity':'Double-leg calf raises (no pain), gentle stretching.','pass':'No pain during double-leg raises'},
      {stage:'3 — Single-leg','activity':'Single-leg calf raises, eccentric focus.','pass':'10+ single-leg raises pain-free'},
      {stage:'4 — Jogging','activity':'Easy jog 10 min, flat surface.','pass':'20-min jog pain-free'},
      {stage:'5 — Running','activity':'Progressive speed build over multiple sessions.','pass':'Can run at 80% without tightness'},
      {stage:'6 — Sprint + change of direction','activity':'Sprint work, acceleration, deceleration.','pass':'Full speed pain-free with no compensation'},
      {stage:'7 — Full return','activity':'Full training session.','pass':'Symmetric calf strength'},
    ]
  },
  lower_back: {
    label:'Lower Back',
    stages:[
      {stage:'1 — Reduce load','activity':'No heavy lifting or twisting. Walking and gentle movement only.','pass':'Pain below 4/10 at rest'},
      {stage:'2 — Core activation','activity':'Dead bugs, bird dogs, gentle cat-cow. No loading.','pass':'No pain during core exercises'},
      {stage:'3 — Stability','activity':'Planks, side planks, glute bridges, hip hinges (bodyweight).','pass':'Can hold plank 60s without pain'},
      {stage:'4 — Light training','activity':'Light jogging, no high-impact. Avoid headers.','pass':'20-min jog with zero back pain'},
      {stage:'5 — Progressive loading','activity':'Return to gym lifts at reduced weight. Monitor closely.','pass':'No pain increase during or 24 hrs after'},
      {stage:'6 — Full training','activity':'All training including heading, jumping, sprinting.','pass':'Full range of motion, symmetric'},
      {stage:'7 — Full return','activity':'Match availability.','pass':'Cleared by medical staff or 3 full sessions pain-free'},
    ]
  },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlayerView({player:initPlayer,team,onLogout}) {
  const [player,setPlayer]=useState(initPlayer);
  const [tab,setTab]=useState('engine');
  const [checkins,setCheckins]=useState([]);
  const [games,setGames]=useState([]);
  const [measurements,setMeasurements]=useState([]);
  const [loading,setLoading]=useState(true);
  const [upcomingEvents,setUpcomingEvents]=useState([]);
  const [myAttendance,setMyAttendance]=useState({});
  const [attendanceNote,setAttendanceNote]=useState('');
  const [respondingTo,setRespondingTo]=useState(null);

  // Engine state
  const [rSleep,setRSleep]=useState(0);
  const [rSore,setRSore]=useState(0);
  const [rInj,setRInj]=useState(false);
  const [rEnergy,setREnergy]=useState(0);
  const [rPrev,setRPrev]=useState(0);
  const [rHard,setRHard]=useState(0);
  const [decision,setDecision]=useState(null);
  const [injuryType,setInjuryType]=useState('ankle');

  // Check-in form
  const [ciForm,setCiForm]=useState({weight_lbs:'',sprint_40m:'',sleep_avg:'',energy_avg:'',soreness_avg:'',days_trained:'',minutes_played:'',training_attended:''});
  const [ciSaving,setCiSaving]=useState(false);
  const [ciMsg,setCiMsg]=useState('');

  // Game form
  const [gForm,setGForm]=useState({});
  const [gSaving,setGSaving]=useState(false);

  const pos=POSITIONS[player.position]||POSITIONS.striker;
  const secondaryPos=player.secondary_position?POSITIONS[player.secondary_position]:null;
  const nutrition=calcNutrition(player);
  const latestCI=checkins[0];
  const gymPlan=buildGymPlan(player.position,player.secondary_position);

  // Performance Index calculation
  function calcPerformanceIndex() {
    let speed=0,endurance=0,strength=0,availability=0,matchImpact=0;
    if (latestCI?.sprint_40m) speed=Math.min(100,Math.round(Math.max(0,(6.0-latestCI.sprint_40m)/1.6*100)));
    if (checkins.length>=2) {
      const recentDays=checkins.slice(0,4).map(c=>c.days_trained||c.days_completed||0);
      endurance=Math.min(100,Math.round((recentDays.reduce((a,b)=>a+b,0)/recentDays.length)/7*100));
    }
    if (latestCI?.weight_lbs&&latestCI?.sprint_40m) strength=Math.min(100,Math.round((speed*0.4+endurance*0.6)));
    if (checkins.length>0) {
      const injuryFreeWeeks=checkins.filter(c=>(c.days_trained||c.days_completed||0)>=4).length;
      availability=Math.min(100,Math.round((injuryFreeWeeks/Math.max(checkins.length,1))*100));
    }
    if (games.length>=2) {
      const ratings=games.filter(g=>g.self_rating).map(g=>g.self_rating);
      matchImpact=ratings.length?Math.min(100,Math.round((ratings.reduce((a,b)=>a+b,0)/ratings.length)*10)):0;
    }
    return {speed,endurance,strength,availability,matchImpact};
  }

  useEffect(()=>{loadAll();},[]);

  async function loadAll() {
    const [{data:cis},{data:gs},{data:ms},{data:evts}]=await Promise.all([
      getCheckins(player.id),getGames(player.id),getMeasurements(player.id),
      getUpcomingEvents(team.id,10)
    ]);
    setCheckins(cis||[]);
    setGames(gs||[]);
    setMeasurements(ms||[]);
    const events=evts||[];
    setUpcomingEvents(events);
    if (events.length>0) {
      const {data:att}=await getPlayerAttendanceForEvents(player.id,events.map(e=>e.id));
      const attMap={};
      (att||[]).forEach(a=>{attMap[a.event_id]=a;});
      setMyAttendance(attMap);
    }
    setLoading(false);
  }

  async function handleAttendance(eventId, status) {
    await respondToEvent(eventId, player.id, status, attendanceNote);
    setMyAttendance(prev=>({...prev,[eventId]:{status,response_note:attendanceNote}}));
    setRespondingTo(null); setAttendanceNote('');
  }

  // Auto-calculate match proximity from schedule
  const today = new Date().toISOString().split('T')[0];
  const nextGame = upcomingEvents.find(e=>e.type==='Game');
  const nextPractice = upcomingEvents.find(e=>e.type==='Practice');
  const nextEvent = upcomingEvents[0];

  function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = Math.round((new Date(dateStr+'T12:00:00') - new Date()) / (1000*60*60*24));
    return diff;
  }
  const daysUntilGame = getDaysUntil(nextGame?.date);
  const daysUntilPractice = getDaysUntil(nextPractice?.date);

  // Derive rMatch automatically from schedule
  const autoMatch = daysUntilGame===0?'today':daysUntilGame===1?'tomorrow':daysUntilGame===2?'2days':daysUntilGame<=3?'3days':'none';

  function calcDecision() {
    let type,title,items=[];
    const effectiveMatch = autoMatch;
    const matchSoon = effectiveMatch==='today'||effectiveMatch==='tomorrow';
    const matchIn2 = effectiveMatch==='2days';
    const practiceToday = daysUntilPractice===0;
    const practiceHighIntensity = nextPractice?.intensity_level==='High'||nextPractice?.intensity_level==='Match';

    if (rInj) {
      type='red'; title='🛑 Injury Protocol Active';
      items=[`Follow the ${INJURY_LADDERS[injuryType]?.label||'injury'} return-to-play ladder`,'Upper body and non-impacted areas only','No sprinting or change of direction','Communicate with your coach and medical staff','Full nutrition — recovery needs fuel'];
    } else if (rHard>=4||rSleep<=5||rSore>=9) {
      type='red'; title='🔴 Recovery Day — Full Rest';
      items=['No structured training today','15-min easy walk maximum','Full nutrition + extra hydration','9+ hours sleep tonight','Foam roll and light stretch only'];
    } else if (effectiveMatch==='today') {
      type='amber'; title='🟡 Match Day — Activation Only';
      items=[`${nextGame?.title||'Match'} today${nextGame?.start_time?' at '+nextGame.start_time:''}${nextGame?.location?' · '+nextGame.location:''}`,
        'Pre-match activation only — 15 min max','No heavy lifting or high-intensity running',
        'Focus on sleep and match nutrition today',
        pos.label+' pre-match: '+pos.sprintFocus.split('+')[0].trim()];
    } else if (effectiveMatch==='tomorrow') {
      type='amber'; title='🟡 Match Tomorrow — Light Technical Work';
      items=[`${nextGame?.title||'Match'} tomorrow${nextGame?.start_time?' at '+nextGame.start_time:''}`,
        'Light technical work + mobility only','No max-effort sprints or heavy strength work',
        'Team training only if coach scheduled it','Prioritize sleep and hydration tonight'];
    } else if (matchIn2) {
      type='amber'; title='🟡 Match in 2 Days — Moderate Session';
      items=['Moderate intensity — 70% max effort','Short sharp speed work only (under 30m)','Strength at reduced weight — skip heavy compounds','Prioritize sleep tonight'];
    } else if (practiceToday&&practiceHighIntensity) {
      type='amber'; title=`🟡 Team Practice Today — ${nextPractice?.intensity_level} Intensity`;
      items=[`${nextPractice?.title||'Practice'} today${nextPractice?.start_time?' at '+nextPractice.start_time:''}${nextPractice?.location?' · '+nextPractice.location:''}`,
        'Complete warm-up and mobility only before practice','Save your energy for the team session',
        nextPractice?.coach_focus?`Coach focus: ${nextPractice.coach_focus}`:'Give full effort in the team session'];
    } else if (rHard>=3||rSleep===6||rSore>=6||rEnergy===2) {
      type='amber'; title='🟡 Reduce Intensity 30%';
      items=['Session at 70% — 2 sets per exercise','Skip high-intensity sprint work — tempo only','Reduce accessory work, keep core compounds','Prioritize 8+ hours sleep tonight'];
    } else {
      type='green'; title='🟢 Full Training Session';
      items=['Execute today\'s full session at full effort','Push for progression on main compound lifts',
        pos.label+': '+pos.sprintFocus,
        practiceToday?`Team practice today${nextPractice?.start_time?' at '+nextPractice.start_time:''} — adjust volume accordingly`:'Prioritize post-session nutrition and recovery'];
    }
    setDecision({type,title,items});
  }

  async function submitCheckin() {
    setCiSaving(true);
    const weekDate=new Date();
    weekDate.setDate(weekDate.getDate()-weekDate.getDay());
    const dateStr=weekDate.toISOString().split('T')[0];
    const adjs=[];
    let calTarget=nutrition.calories;
    const prev=checkins[0];
    if (prev?.weight_lbs&&ciForm.weight_lbs) {
      const diff=parseFloat(ciForm.weight_lbs)-prev.weight_lbs;
      if (diff<0.2&&player.body_goal==='gain'){calTarget+=300;adjs.push({t:'Weight stalled',d:`Increase calories to ${calTarget}/day`});}
      else if (diff<0){calTarget+=500;adjs.push({t:'Losing weight',d:`Urgently increase to ${calTarget} cal/day`});}
    }
    if (ciForm.sleep_avg<6.5) adjs.push({t:'Sleep insufficient',d:'Reduce training intensity until sleep averages 7.5+'});
    if ((ciForm.days_trained||0)<=3) adjs.push({t:'Low training attendance',d:'Reset to previous week volume — do not catch up'});
    const {data}=await saveCheckin(player.id,{week_date:dateStr,...ciForm,cal_target:calTarget,adjustments:adjs});
    if (data){setCheckins([data,...checkins]);setCiMsg('Saved! '+(adjs.length?`${adjs.length} adjustment${adjs.length>1?'s':''} generated.`:'No adjustments needed.'));}
    setCiSaving(false);
  }

  async function submitGame() {
    setGSaving(true);
    const stats={};
    pos.gameStats.forEach(k=>{if(gForm[k]!==undefined&&gForm[k]!=='')stats[k]=parseFloat(gForm[k])||0;});
    const {data}=await saveGame(player.id,{game_date:gForm.date||new Date().toISOString().split('T')[0],opponent:gForm.opponent,minutes_played:parseInt(gForm.minutes)||90,stats,self_rating:parseInt(gForm.self_rating)||null,run_worked:gForm.run_worked,notes:gForm.notes});
    if (data) setGames([data,...games]);
    setGForm({});
    setGSaving(false);
  }

  const perfIndex=calcPerformanceIndex();
  const colorMap={red:[C.redLt,C.red,'#7A1F1F'],amber:[C.amberLt,C.amber,C.amber],green:[C.tealLt,C.teal,C.tealDk]};

  // Profile edit state
  const [profileForm,setProfileForm]=useState({
    name:player.name||'',
    position:player.position||'',
    secondary_position:player.secondary_position||'',
    performance_focus:player.performance_focus||player.body_goal||'maintain',
    bio:player.bio||'',
    jersey_number:player.jersey_number||'',
    preferred_foot:player.preferred_foot||'',
  });
  const [profileSaving,setProfileSaving]=useState(false);
  const [profileMsg,setProfileMsg]=useState('');
  const [avatarUploading,setAvatarUploading]=useState(false);

  async function saveProfile() {
    setProfileSaving(true); setProfileMsg('');
    const {data,error}=await updatePlayer(player.id,{
      name:profileForm.name,
      position:profileForm.position,
      secondary_position:profileForm.secondary_position||null,
      performance_focus:profileForm.performance_focus,
      body_goal:profileForm.performance_focus, // keep for legacy compat
      bio:profileForm.bio,
      jersey_number:profileForm.jersey_number?parseInt(profileForm.jersey_number):null,
      preferred_foot:profileForm.preferred_foot||null,
    });
    if (data){setPlayer(data);setProfileMsg('Profile saved! Changes are live.');}
    else setProfileMsg('Error saving — try again.');
    setProfileSaving(false);
    setTimeout(()=>setProfileMsg(''),4000);
  }

  async function uploadAvatar(e) {
    const file=e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const ext=file.name.split('.').pop();
    const path=`${player.id}.${ext}`;
    const {error:upErr}=await supabase.storage.from('avatars').upload(path,file,{upsert:true});
    if (!upErr) {
      const {data:{publicUrl}}=supabase.storage.from('avatars').getPublicUrl(path);
      const {data}=await updatePlayer(player.id,{avatar_url:publicUrl});
      if (data) setPlayer(data);
    }
    setAvatarUploading(false);
  }

  const TABS=['profile','engine','training','speed','strength','iq','tactics','schedule','lineup','nutrition','game','checkin','progress'];
  const TAB_LABELS={profile:'👤 Profile',engine:'🧠 Engine',training:'Training',speed:'Speed System',strength:'Performance Strength',iq:'Position IQ',tactics:'Team Tactics',schedule:'📅 Schedule',lineup:'Lineup',nutrition:'Nutrition',game:'Game Log',checkin:'Check-In',progress:'Progress'};

  // Availability status
  const available=!player.is_injured;
  const availLabel=player.is_injured?'Injured':'Available';
  const availColor=player.is_injured?C.red:C.teal;

  return (
    <div style={{background:C.bg,minHeight:'100vh'}}>
      {/* ── Header ── */}
      <div style={{background:'linear-gradient(135deg,#0F2D4A,#083A5E,#0A5A8A)',color:'white',padding:'1.25rem 1.75rem 1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8}}>
          <div>
            <h1 style={{fontSize:18,fontWeight:800,margin:0}}>{player.name}</h1>
            <p style={{fontSize:11,opacity:.7,margin:'3px 0 0'}}>{team.name}</p>
          </div>
          <button onClick={onLogout} style={{padding:'6px 14px',borderRadius:8,border:'1px solid rgba(255,255,255,.3)',background:'transparent',color:'white',fontSize:12,cursor:'pointer'}}>Logout</button>
        </div>

        {/* Position badges */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10}}>
          <span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:pos.color,color:'white'}}>{pos.emoji} {pos.label}</span>
          {secondaryPos&&<span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:'rgba(255,255,255,.15)',color:'white'}}>{secondaryPos.emoji} {secondaryPos.label}</span>}
          <span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:available?'rgba(29,158,117,.4)':'rgba(226,75,74,.4)',color:'white'}}>{availLabel}</span>
          {player.coach_focus&&<span style={{fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:700,background:'rgba(255,255,255,.15)',color:'white'}}>📌 {player.coach_focus}</span>}
        </div>

        {/* Key metrics */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginTop:12}}>
          {[
            [latestCI?.sprint_40m||'—','40m Sprint','s'],
            [latestCI?.days_trained??latestCI?.days_completed??'—','Days Trained','/wk'],
            [nextEvent?new Date(nextEvent.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):'No events','Next Event',''],
            [nextEvent?(myAttendance[nextEvent?.id]?.status||'Not Responded'):'—','Attendance',''],
          ].map(([val,lbl,unit])=>(
            <div key={lbl} style={{textAlign:'center',background:'rgba(255,255,255,.1)',borderRadius:8,padding:'7px 4px'}}>
              <div style={{fontSize:val&&val.length>6?11:16,fontWeight:800,color:'white'}}>{val}{unit&&val!=='—'?unit:''}</div>
              <div style={{fontSize:9,opacity:.6}}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Next event banner + attendance buttons */}
        {nextEvent&&(()=>{
          const typeColors={'Practice':C.blue,'Game':C.red,'Team Meeting':C.amber,'Recovery Session':C.teal};
          const tc=typeColors[nextEvent.type]||C.blue;
          const myAtt=myAttendance[nextEvent.id];
          const daysUntil=getDaysUntil(nextEvent.date);
          const urgency=daysUntil===0?'TODAY':daysUntil===1?'TOMORROW':daysUntil<=3?`IN ${daysUntil} DAYS`:'';
          return (
            <div style={{marginTop:10,background:'rgba(255,255,255,.12)',borderRadius:10,padding:'10px 12px',border:`1px solid rgba(255,255,255,.2)`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:6}}>
                <div>
                  <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3}}>
                    <span style={{fontSize:10,padding:'1px 7px',borderRadius:20,fontWeight:700,background:tc,color:'white'}}>{nextEvent.type}</span>
                    {urgency&&<span style={{fontSize:10,fontWeight:800,color:'#FFD700'}}>{urgency}</span>}
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:'white'}}>{nextEvent.title}{nextEvent.opponent?` vs ${nextEvent.opponent}`:''}</div>
                  <div style={{fontSize:11,opacity:.75,marginTop:2}}>
                    {nextEvent.start_time&&nextEvent.start_time+' · '}{nextEvent.location||''}
                    {nextEvent.field_number&&` · ${nextEvent.field_number}`}
                  </div>
                  {nextEvent.coach_focus&&<div style={{fontSize:11,opacity:.85,marginTop:2}}>📌 {nextEvent.coach_focus}</div>}
                </div>
                <div style={{textAlign:'right'}}>
                  {myAtt?<span style={{fontSize:11,padding:'3px 9px',borderRadius:20,fontWeight:700,background:'rgba(255,255,255,.2)',color:'white'}}>{myAtt.status}</span>:
                  <span style={{fontSize:11,color:'rgba(255,255,255,.6)'}}>Not responded</span>}
                </div>
              </div>
              {!myAtt&&(
                <div style={{marginTop:8,display:'flex',gap:6,flexWrap:'wrap'}}>
                  {[['✓ Confirm','Confirmed','#1D9E75'],['? Maybe','Maybe','#BA7517'],['✗ Can\'t Make It','Unavailable','#E24B4A']].map(([lbl,status,color])=>(
                    <button key={status} onClick={()=>setRespondingTo(nextEvent.id)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${color}`,background:color,color:'white',fontSize:11,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
                  ))}
                </div>
              )}
              {myAtt&&(
                <button onClick={()=>setRespondingTo(nextEvent.id)} style={{marginTop:6,padding:'4px 10px',borderRadius:20,border:'1px solid rgba(255,255,255,.3)',background:'transparent',color:'white',fontSize:11,cursor:'pointer'}}>Change response</button>
              )}
            </div>
          );
        })()}

        {/* Attendance response modal */}
        {respondingTo&&(()=>{
          const evt=upcomingEvents.find(e=>e.id===respondingTo);
          return (
            <div style={{marginTop:8,background:'rgba(255,255,255,.15)',borderRadius:10,padding:'10px 12px'}}>
              <div style={{fontSize:12,fontWeight:700,color:'white',marginBottom:6}}>Responding to: {evt?.title}</div>
              <input value={attendanceNote} onChange={e=>setAttendanceNote(e.target.value)} placeholder="Optional note (e.g. May be 10 min late)" style={{width:'100%',padding:'6px 9px',borderRadius:7,border:'1px solid rgba(255,255,255,.3)',background:'rgba(255,255,255,.1)',color:'white',fontSize:12,fontFamily:'inherit',marginBottom:6}}/>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[['✓ Confirmed','Confirmed','#1D9E75'],['? Maybe','Maybe','#BA7517'],['✗ Unavailable','Unavailable','#E24B4A']].map(([lbl,status,color])=>(
                  <button key={status} onClick={()=>handleAttendance(respondingTo,status)} style={{padding:'5px 14px',borderRadius:20,border:`1px solid ${color}`,background:color,color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
                ))}
                <button onClick={()=>setRespondingTo(null)} style={{padding:'5px 10px',borderRadius:20,border:'1px solid rgba(255,255,255,.3)',background:'transparent',color:'white',fontSize:11,cursor:'pointer'}}>Cancel</button>
              </div>
            </div>
          );
        })()}

        {player.coach_note&&<div style={{marginTop:8,padding:'6px 10px',background:'rgba(255,255,255,.1)',borderRadius:8,fontSize:12,opacity:.9}}>📋 Coach: {player.coach_note}</div>}
      </div>

      {/* ── Nav ── */}
      <div style={{display:'flex',gap:4,padding:'.6rem 1rem',background:'white',borderBottom:`1px solid ${C.border}`,flexWrap:'wrap',position:'sticky',top:0,zIndex:100}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'5px 10px',borderRadius:20,border:`1px solid ${tab===t?C.blue:C.border}`,background:tab===t?C.blue:'white',color:tab===t?'white':C.muted,cursor:'pointer',fontSize:11,fontWeight:500,whiteSpace:'nowrap'}}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={{padding:'1.25rem',maxWidth:1100,margin:'0 auto'}}>

        {/* ══ PROFILE ══ */}
        {tab==='profile'&&<>
          <Sh>Your Profile</Sh>
          <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:'1.5rem'}}>
            {/* Avatar */}
            <div style={{textAlign:'center'}}>
              <div style={{width:150,height:150,borderRadius:'50%',background:C.bg,border:`3px solid ${pos.color}`,margin:'0 auto 12px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>
                {player.avatar_url?<img src={player.avatar_url} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(player.name?.split(' ').map(n=>n[0]).join('')||'?')}
              </div>
              <label style={{display:'inline-block',padding:'7px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:'white',fontSize:12,fontWeight:600,cursor:'pointer',color:C.muted}}>
                {avatarUploading?'Uploading...':'📷 Change Photo'}
                <input type="file" accept="image/*" onChange={uploadAvatar} style={{display:'none'}}/>
              </label>
              <div style={{marginTop:12,textAlign:'center'}}>
                <div style={{fontSize:13,fontWeight:700}}>{player.name}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{pos.emoji} {pos.label}</div>
                {player.jersey_number&&<div style={{fontSize:11,color:C.muted}}>#{player.jersey_number}</div>}
                {player.bio&&<div style={{fontSize:11,color:C.muted,marginTop:6,lineHeight:1.5,fontStyle:'italic'}}>"{player.bio}"</div>}
              </div>
            </div>

            {/* Edit form */}
            <Card>
              <div style={{fontSize:13,fontWeight:800,marginBottom:12,color:C.text}}>Edit Profile</div>
              <Inp label="Display name" value={profileForm.name} onChange={e=>setProfileForm(f=>({...f,name:e.target.value}))} placeholder="First + Last name"/>
              <Inp label="Jersey number" type="number" value={profileForm.jersey_number} onChange={e=>setProfileForm(f=>({...f,jersey_number:e.target.value}))} placeholder="e.g. 10"/>

              <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:6}}>Primary position</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:10}}>
                {Object.entries(POSITIONS).map(([k,p])=>(
                  <div key={k} onClick={()=>setProfileForm(f=>({...f,position:k,secondary_position:f.secondary_position===k?'':f.secondary_position}))}
                    style={{padding:'8px 6px',borderRadius:8,border:`2px solid ${profileForm.position===k?p.color:C.border}`,background:profileForm.position===k?p.colorLight:'white',cursor:'pointer',textAlign:'center'}}>
                    <div style={{fontSize:18}}>{p.emoji}</div>
                    <div style={{fontSize:10,fontWeight:700,marginTop:2,color:profileForm.position===k?p.color:C.text}}>{p.label}</div>
                  </div>
                ))}
              </div>

              <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>Secondary position <span style={{fontWeight:400}}>(optional)</span></label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:10}}>
                {Object.entries(POSITIONS).map(([k,p])=>(
                  <div key={k} onClick={()=>setProfileForm(f=>({...f,secondary_position:f.secondary_position===k?'':k}))}
                    style={{padding:'8px 6px',borderRadius:8,border:`2px solid ${profileForm.secondary_position===k?p.color:profileForm.position===k?'#E0DED7':C.border}`,background:profileForm.secondary_position===k?p.colorLight:profileForm.position===k?'#F5F4F0':'white',cursor:profileForm.position===k?'not-allowed':'pointer',textAlign:'center',opacity:profileForm.position===k?0.4:1}}>
                    <div style={{fontSize:18}}>{p.emoji}</div>
                    <div style={{fontSize:10,fontWeight:700,marginTop:2,color:profileForm.secondary_position===k?p.color:C.text}}>{p.label}</div>
                  </div>
                ))}
              </div>

              <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:6}}>Preferred foot</label>
              <div style={{display:'flex',gap:6,marginBottom:10}}>
                {[['Right','right'],['Left','left'],['Both','both']].map(([lbl,val])=>(
                  <button key={val} onClick={()=>setProfileForm(f=>({...f,preferred_foot:val}))} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${profileForm.preferred_foot===val?C.blue:C.border}`,background:profileForm.preferred_foot===val?C.blueLt:'white',color:profileForm.preferred_foot===val?C.blueDk:C.muted,fontSize:12,cursor:'pointer',fontWeight:profileForm.preferred_foot===val?700:400}}>{lbl}</button>
                ))}
              </div>

              <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:6}}>Performance focus</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:10}}>
                {Object.entries(PERFORMANCE_FOCUS).map(([k,f])=>(
                  <button key={k} onClick={()=>setProfileForm(p=>({...p,performance_focus:k}))} style={{padding:'6px 12px',borderRadius:20,border:`2px solid ${profileForm.performance_focus===k?C.blue:C.border}`,background:profileForm.performance_focus===k?C.blueLt:'white',fontSize:12,fontWeight:profileForm.performance_focus===k?700:400,cursor:'pointer',color:profileForm.performance_focus===k?C.blueDk:C.muted}}>{f.label}</button>
                ))}
              </div>

              <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>Bio / personal note</label>
              <textarea value={profileForm.bio} onChange={e=>setProfileForm(f=>({...f,bio:e.target.value}))} placeholder="e.g. Box-to-box midfielder. Work rate and pressing are my strengths." rows={3} style={{width:'100%',padding:'7px 9px',borderRadius:7,border:`1px solid ${C.border}`,fontSize:12,fontFamily:'inherit',resize:'vertical',marginBottom:10}}/>

              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button onClick={saveProfile} disabled={profileSaving} style={{padding:'8px 20px',borderRadius:8,border:'none',background:C.blue,color:'white',fontSize:13,fontWeight:700,cursor:'pointer'}}>{profileSaving?'Saving...':'Save Changes'}</button>
                {profileMsg&&<span style={{fontSize:12,color:profileMsg.includes('Error')?C.red:C.teal,fontWeight:600}}>{profileMsg}</span>}
              </div>
            </Card>
          </div>
        </>}

        {/* ══ ENGINE ══ */}
        {tab==='engine'&&<>
          <Sh>Daily Readiness — What Should I Do Today?</Sh>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div>
              {[
                ['Sleep last night?',[['8+ hrs',8,'teal'],['7 hrs',7,'teal'],['6 hrs',6,'amber'],['≤5 hrs',5,'red']],rSleep,setRSleep],
                ['Muscle soreness?',[['None',1,'teal'],['Mild (1-4)',4,'teal'],['Moderate (5-6)',6,'amber'],['Heavy (7-8)',8,'amber'],['Pain 9-10',10,'red']],rSore,setRSore],
                ['Energy level?',[['High',3,'teal'],['Moderate',2,'amber'],['Low',1,'red']],rEnergy,setREnergy],
                ['Yesterday was?',[['Rest / Easy',0,'teal'],['Moderate',1,'amber'],['Intense',2,'red']],rPrev,setRPrev],
                ['Hard sessions this week?',[['0',0,'teal'],['1-2',2,'teal'],['3',3,'amber'],['4+',4,'red']],rHard,setRHard],
              ].map(([label,opts,val,setter])=>(
                <Card key={label} style={{marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>{label}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                    {opts.map(([lbl,v,col])=>{
                      const sel=val===v;
                      const bg=sel?(col==='teal'?C.teal:col==='amber'?C.amber:C.red):'white';
                      return <button key={lbl} onClick={()=>setter(v)} style={{padding:'4px 10px',borderRadius:20,border:`1px solid ${sel?(col==='teal'?C.teal:col==='amber'?C.amber:C.red):C.border}`,background:bg,color:sel?'white':C.muted,fontSize:11,cursor:'pointer',fontWeight:sel?700:400}}>{lbl}</button>;
                    })}
                  </div>
                </Card>
              ))}

              {/* Injury toggle */}
              <Card style={{marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Active injury?</div>
                <div style={{display:'flex',gap:6,marginBottom:rInj?8:0}}>
                  {[['No injury',false,'teal'],['Yes — injured',true,'red']].map(([lbl,v,col])=>{
                    const sel=rInj===v;
                    return <button key={lbl} onClick={()=>setRInj(v)} style={{padding:'4px 12px',borderRadius:20,border:`1px solid ${sel?(col==='teal'?C.teal:C.red):C.border}`,background:sel?(col==='teal'?C.teal:C.red):'white',color:sel?'white':C.muted,fontSize:11,cursor:'pointer'}}>{lbl}</button>;
                  })}
                </div>
                {rInj&&(
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Injury type:</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                      {Object.entries(INJURY_LADDERS).map(([key,inj])=>(
                        <button key={key} onClick={()=>setInjuryType(key)} style={{padding:'3px 10px',borderRadius:20,border:`1px solid ${injuryType===key?C.red:C.border}`,background:injuryType===key?C.redLt:'white',color:injuryType===key?C.red:C.muted,fontSize:11,cursor:'pointer',fontWeight:injuryType===key?700:400}}>{inj.label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <button onClick={calcDecision} style={{width:'100%',padding:11,borderRadius:10,border:'none',background:C.blue,color:'white',fontSize:13,fontWeight:700,cursor:'pointer'}}>→ Get Today's Plan</button>
            </div>

            <div>
              {decision&&(()=>{
                const [bg,brd,clr]=colorMap[decision.type];
                return <div style={{background:bg,border:`2px solid ${brd}`,borderRadius:10,padding:'1rem 1.25rem',marginBottom:'1rem'}}>
                  <div style={{fontSize:14,fontWeight:700,color:clr,marginBottom:8}}>{decision.title}</div>
                  <ul style={{paddingLeft:'1rem',lineHeight:2.2,fontSize:13,color:clr}}>
                    {decision.items.map(i=><li key={i}>{i}</li>)}
                  </ul>
                </div>;
              })()}
              <Sh>Hard Cap Rules</Sh>
              <Card>
                <div style={{fontSize:12,color:C.red,fontWeight:700,marginBottom:6}}>Maximum 4 high-intensity sessions per week</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.9}}>
                  Sprint sessions ≤ 2/week · Strength sessions ≤ 3/week · Total sessions ≤ 6/week<br/>
                  Deload weeks: 4, 8, 12 — reduce all volume by 40%<br/>
                  Match day: activation only, no heavy work
                </div>
              </Card>
              {upcomingEvents.length>0&&<>
                <Sh>Upcoming Team Events</Sh>
                {upcomingEvents.slice(0,3).map(evt=>{
                  const dUntil=getDaysUntil(evt.date);
                  const myAtt=myAttendance[evt.id];
                  const typeColors={'Practice':C.blue,'Game':C.red,'Team Meeting':C.amber,'Recovery Session':C.teal};
                  const tc=typeColors[evt.type]||C.blue;
                  return (
                    <Card key={evt.id} style={{marginBottom:6,borderColor:`${tc}40`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:tc,marginBottom:2}}>{evt.type.toUpperCase()} · {dUntil===0?'TODAY':dUntil===1?'TOMORROW':`IN ${dUntil} DAYS`}</div>
                          <div style={{fontSize:12,fontWeight:700}}>{evt.title}{evt.opponent?` vs ${evt.opponent}`:''}</div>
                          <div style={{fontSize:11,color:C.muted}}>{evt.start_time&&evt.start_time+' · '}{evt.location}</div>
                        </div>
                        <span style={{fontSize:10,padding:'2px 7px',borderRadius:20,fontWeight:700,background:myAtt?.status==='Confirmed'?C.tealLt:myAtt?.status==='Unavailable'?C.redLt:C.bg,color:myAtt?.status==='Confirmed'?C.teal:myAtt?.status==='Unavailable'?C.red:C.muted}}>{myAtt?.status||'Not Responded'}</span>
                      </div>
                    </Card>
                  );
                })}
              </>}
              <Sh>Your Position Profile</Sh>
              <Card>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:10}}>
                  <div style={{fontSize:32}}>{pos.emoji}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:700}}>{pos.label}</div>
                    <div style={{fontSize:12,color:C.muted}}>{pos.tagline}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>Gym priority: {pos.gymPriority}</div>
                  </div>
                </div>
                {[['Speed focus',pos.sprintFocus],['Strength focus',pos.strengthFocus],['Endurance',pos.enduranceFocus],['Agility',pos.agilityFocus]].map(([k,v])=>(
                  <div key={k} style={{display:'flex',gap:6,padding:'4px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                    <span style={{fontWeight:700,color:C.muted,minWidth:90}}>{k}:</span><span>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </>}

        {/* ══ TRAINING ══ */}
        {tab==='training'&&<>
          <Sh>Role-Based Weekly Structure</Sh>
          <Hbox color="blue">Every session answers: "What do I do today to help my team perform better?" Training adapts to your position, fatigue, and match schedule.</Hbox>
          <Card>
            {[
              ['MON','Conditioning','Aerobic base + position-specific movement patterns'],
              ['TUE','Performance Strength','Lower body power + upper body stability'],
              ['WED','Speed + Agility','Position-specific sprint work + reaction drills'],
              ['THU','Performance Strength','Total body strength + explosive movements'],
              ['FRI','Technical + Conditioning','Ball work + conditioning circuits'],
              ['SAT','★ Main Speed Day','Position protocol — maximum quality, full recovery'],
              ['SUN','Recovery + Check-In','Easy movement + weekly check-in + meal prep'],
            ].map(([day,type,desc])=>(
              <div key={day} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:32,height:28,borderRadius:'50%',background:day==='SAT'?'#FAC775':day==='SUN'?C.bg:C.blueLt,color:day==='SAT'?'#633806':day==='SUN'?C.muted:C.blueDk,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,flexShrink:0,marginTop:2}}>{day}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700}}>{type}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{desc}</div>
                </div>
              </div>
            ))}
          </Card>

          <Sh>12-Week Phase Schedule — {pos.label}</Sh>
          <TblWrap>
            <thead><tr><Th>Week</Th><Th>Theme</Th><Th>Focus</Th></tr></thead>
            <tbody>{pos.weeklyThemes.map((theme,i)=>(
              <tr key={i} style={{background:theme==='DELOAD'?C.amberLt:i%2===0?C.bg:'white'}}>
                <Td hl>{i+1}</Td>
                <Td hl>{theme}</Td>
                <Td>{theme==='DELOAD'?'40% volume reduction · No intensity PRs · 9hrs sleep · Active recovery only':`${pos.label} — ${pos.tagline}`}</Td>
              </tr>
            ))}</tbody>
          </TblWrap>

          <Sh>Position-Adaptive Training Logic</Sh>
          <Card>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Your training is weighted:</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
              <div style={{background:pos.colorLight,borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:700,color:pos.color}}>{pos.emoji} {pos.label} — 70%</div>
              {secondaryPos&&<div style={{background:secondaryPos.colorLight,borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:700,color:secondaryPos.color}}>{secondaryPos.emoji} {secondaryPos.label} — 30%</div>}
            </div>
            {[['Speed focus',pos.sprintFocus],['Strength focus',pos.strengthFocus],['Endurance',pos.enduranceFocus],['Agility',pos.agilityFocus]].map(([k,v])=>(
              <div key={k} style={{display:'flex',gap:6,padding:'5px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span style={{fontWeight:700,color:C.muted,minWidth:110}}>{k}:</span><span>{v}</span>
              </div>
            ))}
          </Card>

          <Sh>Deload Protocol (Weeks 4, 8, 12)</Sh>
          <Card>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:12}}>
              <div><div style={{fontWeight:700,marginBottom:6}}>What changes</div>
                <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}><li>60% of normal load</li><li>2 sets per exercise</li><li>No max-effort sprints</li><li>No intensity PRs</li><li>Wednesday = full low day</li></ul>
              </div>
              <div><div style={{fontWeight:700,marginBottom:6}}>What stays</div>
                <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}><li>Daily movement</li><li>Injury prevention work</li><li>Full nutrition</li><li>9 hrs sleep nightly</li><li>Technical/ball work</li></ul>
              </div>
            </div>
            <Hbox color="green">Deload is where adaptation locks in. You will come back noticeably faster and stronger.</Hbox>
          </Card>
        </>}

        {/* ══ SPEED SYSTEM ══ */}
        {tab==='speed'&&<>
          <Hbox color="red">Quality rule: if any sprint drops more than 5% — stop the session. Speed training is wasted when fatigued.</Hbox>
          <Sh>{pos.label} Speed Protocol</Sh>
          {pos.sprintSessions.map(session=>(
            <div key={session.phase}>
              <Sh>{session.phase}</Sh>
              <TblWrap>
                <thead><tr><Th>Distance</Th><Th>Sets</Th><Th>Effort</Th><Th>Rest</Th></tr></thead>
                <tbody>{session.reps.map((r,i)=>(
                  <tr key={i} style={{background:i%2===0?C.bg:'white'}}>
                    <Td hl>{r.dist}</Td><Td>{r.sets}</Td><Td>{r.effort}</Td><Td>{r.rest}</Td>
                  </tr>
                ))}</tbody>
              </TblWrap>
            </div>
          ))}

          <Sh>Speed Phase Progression</Sh>
          <TblWrap>
            <thead><tr><Th>Phase</Th><Th>Weeks</Th><Th>Focus</Th></tr></thead>
            <tbody>
              <tr style={{background:C.bg}}><Td hl>1 — Mechanics</Td><Td>1–4</Td><Td>Technique, acceleration, drive phase, curved runs</Td></tr>
              <tr><Td hl>2 — Max Velocity</Td><Td>5–8</Td><Td>Top-end speed + plyometrics added + ball-involved sprinting</Td></tr>
              <tr style={{background:C.bg}}><Td hl>3 — Game Endurance</Td><Td>9–12</Td><Td>Repeat sprint ability, reaction sprints, late-game speed</Td></tr>
            </tbody>
          </TblWrap>

          <Sh>Ball-Involved Speed Work</Sh>
          <Card>
            <div style={{fontSize:12,marginBottom:6,fontWeight:700}}>Add these to your speed sessions 1-2x per week:</div>
            <TblWrap>
              <thead><tr><Th>Drill</Th><Th>Distance</Th><Th>Reps</Th><Th>Focus</Th></tr></thead>
              <tbody>{[
                ['Receive + accelerate','20m','6','First touch into space then sprint — game realistic'],
                ['Press + recover','15m press + 15m recovery','4','Simulate press then recovery run'],
                ['Reaction sprint','10m on visual signal','8','Reaction time — keep head up'],
                ['Curved runs','Arc 25m','5 each side','Attack from wide, cut inside — winger/striker specific'],
                ['Overlap run','40m','4','Full-pace overlap, receive, cross or shoot'],
              ].map(([d,dist,reps,focus],i)=>(
                <tr key={i} style={{background:i%2===0?C.bg:'white'}}><Td hl>{d}</Td><Td>{dist}</Td><Td>{reps}</Td><Td>{focus}</Td></tr>
              ))}</tbody>
            </TblWrap>
          </Card>

          <Sh>Injury Return-to-Play Ladders</Sh>
          {Object.entries(INJURY_LADDERS).map(([key,ladder])=>(
            <div key={key}>
              <Sh>{ladder.label}</Sh>
              <TblWrap>
                <thead><tr><Th>Stage</Th><Th>Activity</Th><Th>Pass Condition</Th></tr></thead>
                <tbody>{ladder.stages.map((s,i)=>(
                  <tr key={i} style={{background:i%2===0?C.bg:'white'}}><Td hl>{s.stage}</Td><Td>{s.activity}</Td><Td>{s.pass}</Td></tr>
                ))}</tbody>
              </TblWrap>
            </div>
          ))}
        </>}

        {/* ══ PERFORMANCE STRENGTH ══ */}
        {tab==='strength'&&<>
          <Hbox color="blue">Progressive overload: add weight or reps every session. Shoulder protection: band external rotations 2×15 on every upper body day.</Hbox>
          <div style={{background:C.purpleLt,borderLeft:`3px solid ${C.purple}`,color:C.purple,borderRadius:'0 6px 6px 0',padding:'7px 11px',marginTop:8,fontSize:12,lineHeight:1.6,marginBottom:'1rem'}}>
            <strong>{pos.gymPriority}</strong> — Built for {pos.label}{secondaryPos?` + ${secondaryPos.label}`:''}.
            Sets × Reps: {pos.gymStyle.sets} × {pos.gymStyle.reps} · Rest: {pos.gymStyle.rest}
          </div>

          {[['Tuesday',gymPlan.tuesday],['Thursday',gymPlan.thursday],['Friday',gymPlan.friday]].map(([day,exercises])=>(
            <div key={day}>
              <Sh>{day}</Sh>
              <TblWrap>
                <thead><tr><Th>Exercise</Th><Th>Sets × Reps</Th><Th>Tempo</Th><Th>Focus</Th></tr></thead>
                <tbody>{(exercises||[]).map((ex,i)=>{
                  const isExtra=ex.focus.startsWith('[');
                  return <tr key={i} style={{background:isExtra?C.tealLt:i%2===0?C.bg:'white'}}>
                    <Td hl>{ex.ex}</Td><Td>{ex.sets}</Td><Td>{ex.tempo}</Td><Td>{ex.focus}</Td>
                  </tr>;
                })}</tbody>
              </TblWrap>
            </div>
          ))}

          <Sh>Injury Prevention — Always Include</Sh>
          <TblWrap>
            <thead><tr><Th>Exercise</Th><Th>Sets × Reps</Th><Th>Why</Th></tr></thead>
            <tbody>{[
              ['Nordic hamstring curls','3×5–8 eccentric','Highest-evidence hamstring injury prevention in football'],
              ['Copenhagen planks','3×20s each side','Groin injury prevention — critical for all positions'],
              ['Single-leg calf raises (slow)','3×15 each','Achilles + lower leg resilience'],
              ['Band external rotations','2×15 each','Shoulder health — especially important for goalkeepers'],
              ['Hip 90/90 mobility','2×60s each','Hip flexor + rotator health for kicking and acceleration'],
              ['Glute bridges / Hip thrust','3×12','Posterior chain activation + knee stability'],
            ].map(([ex,sets,why],i)=>(
              <tr key={i} style={{background:i%2===0?C.bg:'white'}}><Td hl>{ex}</Td><Td>{sets}</Td><Td>{why}</Td></tr>
            ))}</tbody>
          </TblWrap>

          <Sh>Training Categories Explained</Sh>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              ['Lower Body Power','Squats, RDLs, lunges, box jumps — force production for sprinting, jumping, tackling'],
              ['Upper Body Stability','Rows, pull-ups, push-ups, overhead press — not for size, for shoulder health and aerial ability'],
              ['Total Body Strength','Deadlifts, power cleans, carries — whole-body coordination and physical presence'],
              ['Core (Anti-rotation)','Planks, dead bugs, Pallof press, carries — the foundation of every movement on the pitch'],
            ].map(([title,desc])=>(
              <div key={title} style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>{title}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>{desc}</div>
              </div>
            ))}
          </div>
        </>}

        {/* ══ POSITION IQ ══ */}
        {tab==='iq'&&<>
          <div style={{marginBottom:'1rem'}}>
            <h3 style={{fontSize:15,fontWeight:800,marginBottom:4}}>{pos.emoji} {pos.label} Decision Scenarios</h3>
            <p style={{fontSize:12,color:C.muted}}>10 minutes of mental reps before a session. Real game situations — choose your action and learn the reasoning.</p>
          </div>
          <IQQuiz scenarios={pos.iq} posColor={pos.color}/>
          {secondaryPos&&<>
            <div style={{margin:'1.5rem 0 1rem',paddingTop:'1rem',borderTop:`1px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,marginBottom:4}}>{secondaryPos.emoji} {secondaryPos.label} Decision Scenarios</h3>
              <p style={{fontSize:12,color:C.muted}}>Secondary position scenarios for your hybrid role.</p>
            </div>
            <IQQuiz scenarios={secondaryPos.iq} posColor={secondaryPos.color}/>
          </>}

          <Sh>Your Role in Team Tactics</Sh>
          <Card>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>{pos.emoji} {pos.label} — Tactical Responsibilities</div>
            {[
              ['In possession',pos.sprintFocus],
              ['Out of possession',pos.strengthFocus],
              ['Pressing trigger',pos.agilityFocus],
              ['Transition priority',pos.enduranceFocus],
            ].map(([k,v])=>(
              <div key={k} style={{display:'flex',gap:8,padding:'6px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span style={{fontWeight:700,color:C.muted,minWidth:130}}>{k}:</span><span>{v}</span>
              </div>
            ))}
            {player.coach_focus&&<div style={{marginTop:10,background:C.tealLt,borderRadius:8,padding:'8px 10px',fontSize:12,color:C.tealDk,fontWeight:600}}>📌 Coach this week: {player.coach_focus}</div>}
          </Card>
        </>}

        {/* ══ TACTICS ══ */}
        {tab==='tactics'&&<TacticsView/>}

        {/* ══ SCHEDULE ══ */}
        {tab==='schedule'&&<ScheduleView team={team} isCoach={false}/>}

        {/* ══ LINEUP ══ */}
        {tab==='lineup'&&<LineupView team={team} isCoach={false} currentPlayerId={player.id}/>}

        {/* ══ NUTRITION ══ */}
        {tab==='nutrition'&&<>
          {nextEvent&&(()=>{
            const dUntil=getDaysUntil(nextEvent.date);
            let dayType='Training Day', advice='';
            if (nextEvent.type==='Game'&&dUntil===0){dayType='Match Day';advice='High carbs from last night. Light meal 3-4hrs before kickoff. Hydrate all day. Recovery shake within 30 min post-match.';}
            else if (nextEvent.type==='Game'&&dUntil===1){dayType='Pre-Match Day';advice='High carbs today to load for tomorrow. Lighter dinner. 9hrs sleep. No heavy gym work.';}
            else if (nextEvent.type==='Recovery Session'&&dUntil===0){dayType='Recovery Day';advice='Lower carbs, higher protein. Anti-inflammatory foods. Extra hydration. No training nutrition needed.';}
            else if (nextEvent.type==='Practice'&&(nextEvent.intensity_level==='High'||nextEvent.intensity_level==='Match')&&dUntil===0){dayType='High-Intensity Training Day';advice='Extra carbs pre-session. Intra-session carbs if over 60 min. Recovery nutrition within 30 min.';}
            else {dayType='Training Day';}
            return <div style={{background:C.blueLt,borderLeft:`3px solid ${C.blue}`,borderRadius:'0 8px 8px 0',padding:'8px 12px',marginBottom:12,fontSize:12}}>
              <span style={{fontWeight:700,color:C.blueDk}}>{dayType}</span>
              {advice&&<span style={{color:C.blueDk}}> — {advice}</span>}
            </div>;
          })()}
          <Sh>Nutrition by Day Type</Sh>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:'1rem'}}>
            {[
              ['Match Day',C.red,C.redLt,'High carbs from the night before. Light breakfast 3-4 hrs before KO. No heavy meals. Hydrate all day. Post-match: protein + carbs within 30 min.'],
              ['Training Day',C.blue,C.blueLt,'Moderate-high carbs. Pre-session meal 2 hrs before. Post-session recovery within 30 min. Protein at every meal.'],
              ['Recovery Day',C.teal,C.tealLt,'Lower carbs, higher protein. Focus on anti-inflammatory foods. Extra hydration. Sleep-supporting foods in the evening.'],
              ['Rest Day',C.amber,C.amberLt,'Eat to fuel the next day, not the current day. Moderate calories. Quality whole foods. No reason to undereat — muscles repair at rest.'],
            ].map(([type,color,bg,desc])=>(
              <div key={type} style={{background:bg,borderRadius:10,padding:'10px 12px',border:`1px solid ${color}20`}}>
                <div style={{fontSize:12,fontWeight:800,color,marginBottom:5}}>{type}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>{desc}</div>
              </div>
            ))}
          </div>

          <Sh>Your Daily Targets</Sh>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:'1rem'}}>
            {[['Calories',nutrition.calories,'cal'],['Protein',nutrition.protein,'g'],['Carbs',nutrition.carbs,'g'],['Fats',nutrition.fat,'g']].map(([l,v,u])=>(
              <Card key={l} style={{textAlign:'center',padding:'.875rem',marginBottom:0}}>
                <div style={{fontSize:22,fontWeight:800,color:C.blue}}>{v}</div>
                <div style={{fontSize:11,color:C.muted}}>{l} {u}</div>
              </Card>
            ))}
          </div>
          <Hbox color="amber">{pos.carbTiming}</Hbox>

          <Sh>Hydration Rules</Sh>
          <Card>
            <TblWrap>
              <thead><tr><Th>When</Th><Th>Target</Th></tr></thead>
              <tbody>{[
                ['Morning (on waking)','500ml water immediately'],
                ['2 hours before training','500ml water'],
                ['During training','200-300ml every 20 minutes'],
                ['Post training','500-750ml + electrolytes if sweating heavily'],
                ['Match day (all day)','3-4L total — start hydrating the night before'],
                ['Recovery days','2-3L minimum'],
              ].map(([when,target],i)=>(
                <tr key={i} style={{background:i%2===0?C.bg:'white'}}><Td hl>{when}</Td><Td>{target}</Td></tr>
              ))}</tbody>
            </TblWrap>
          </Card>

          <Sh>Timing Principles</Sh>
          <Card>
            {[
              ['Pre-session (2-3 hrs)','Carb-dominant meal. Rice, pasta, bread, oats. Light protein. Low fat and fiber — digests faster.'],
              ['Pre-session (30-60 min)','Small carb snack only. Banana, rice cake, small yogurt. Nothing heavy.'],
              ['During session (60+ min)','Simple carbs if session is over 60 min. Fruit, sports drink, dates.'],
              ['Post-session (within 30 min)','Protein + carbs immediately. Critical recovery window. Shake + banana or chicken + rice.'],
            ].map(([t,d])=>(
              <div key={t} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span style={{fontWeight:700,color:C.muted,minWidth:150,flexShrink:0}}>{t}</span><span>{d}</span>
              </div>
            ))}
          </Card>
        </>}

        {/* ══ GAME LOG ══ */}
        {tab==='game'&&<>
          <Sh>Log a Game</Sh>
          <Card>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8}}>
              <Inp label="Date" type="date" value={gForm.date||''} onChange={e=>setGForm(f=>({...f,date:e.target.value}))}/>
              <Inp label="Opponent" placeholder="e.g. FC Rivals" value={gForm.opponent||''} onChange={e=>setGForm(f=>({...f,opponent:e.target.value}))}/>
              <Inp label="Minutes played" type="number" placeholder="90" value={gForm.minutes||''} onChange={e=>setGForm(f=>({...f,minutes:e.target.value}))}/>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:'uppercase',letterSpacing:'.6px'}}>{pos.label} Stats</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8,marginBottom:12}}>
              {pos.gameStats.map(k=>(
                <Inp key={k} label={pos.gameStatLabels[k]} type="number" min="0" placeholder="0" value={gForm[k]||''} onChange={e=>setGForm(f=>({...f,[k]:e.target.value}))}/>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
              <Inp label="Self-rating (1–10)" type="number" min="1" max="10" placeholder="7" value={gForm.self_rating||''} onChange={e=>setGForm(f=>({...f,self_rating:e.target.value}))}/>
              <Inp label="What worked" placeholder="e.g. Press triggers sharp" value={gForm.run_worked||''} onChange={e=>setGForm(f=>({...f,run_worked:e.target.value}))}/>
            </div>
            <Inp label="Notes (1 worked / 1 to fix)" placeholder="e.g. Positioning sharp / late-game energy dropped" value={gForm.notes||''} onChange={e=>setGForm(f=>({...f,notes:e.target.value}))}/>
            <button onClick={submitGame} disabled={gSaving} style={{padding:'7px 18px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>{gSaving?'Saving...':'Save Game →'}</button>
          </Card>

          <Sh>Game History</Sh>
          {games.length===0?<div style={{color:C.muted,fontSize:13}}>No games logged yet.</div>:(
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead><tr>{['Date','Opponent','Min',...pos.gameStats.map(k=>pos.gameStatLabels[k]),'Rating','Notes'].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>{games.map((g,i)=>(
                  <tr key={g.id} style={{background:i%2===0?C.bg:'white'}}>
                    <Td>{g.game_date}</Td><Td>{g.opponent||'—'}</Td><Td>{g.minutes_played}'</Td>
                    {pos.gameStats.map(k=><Td key={k} hl={k==='goals'||k==='saves'}>{g.stats?.[k]??'—'}</Td>)}
                    <Td><span style={{fontWeight:700,color:g.self_rating>=8?C.teal:g.self_rating>=6?C.amber:C.red}}>{g.self_rating||'—'}</span></Td>
                    <Td>{g.run_worked||'—'}</Td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </>}

        {/* ══ CHECK-IN ══ */}
        {tab==='checkin'&&<>
          <Sh>Weekly Check-In — Complete Every Sunday</Sh>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <Card>
              <div style={{display:'grid',gap:6}}>
                <Inp label="Weight (lbs)" type="number" placeholder="e.g. 172" value={ciForm.weight_lbs} onChange={e=>setCiForm(f=>({...f,weight_lbs:e.target.value}))}/>
                <Inp label="Best 40m sprint (s)" type="number" step="0.01" placeholder="e.g. 4.9" value={ciForm.sprint_40m} onChange={e=>setCiForm(f=>({...f,sprint_40m:e.target.value}))}/>
                <Inp label="Avg sleep (hrs/night)" type="number" step="0.5" placeholder="e.g. 7.5" value={ciForm.sleep_avg} onChange={e=>setCiForm(f=>({...f,sleep_avg:e.target.value}))}/>
                <Inp label="Overall energy (1–10)" type="number" min="1" max="10" placeholder="e.g. 7" value={ciForm.energy_avg} onChange={e=>setCiForm(f=>({...f,energy_avg:e.target.value}))}/>
                <Inp label="Avg soreness (1–10)" type="number" min="1" max="10" placeholder="e.g. 4" value={ciForm.soreness_avg} onChange={e=>setCiForm(f=>({...f,soreness_avg:e.target.value}))}/>
                <Inp label="Training days completed" type="number" min="0" max="7" placeholder="e.g. 5" value={ciForm.days_trained} onChange={e=>setCiForm(f=>({...f,days_trained:e.target.value}))}/>
                <Inp label="Minutes played this week" type="number" placeholder="e.g. 90" value={ciForm.minutes_played} onChange={e=>setCiForm(f=>({...f,minutes_played:e.target.value}))}/>
                <Inp label="Team training sessions attended" type="number" min="0" max="7" placeholder="e.g. 3" value={ciForm.training_attended} onChange={e=>setCiForm(f=>({...f,training_attended:e.target.value}))}/>
                <button onClick={submitCheckin} disabled={ciSaving} style={{padding:'8px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>{ciSaving?'Saving...':'Save Check-In →'}</button>
                {ciMsg&&<div style={{fontSize:12,color:C.tealDk,fontWeight:600,padding:'6px 8px',background:C.tealLt,borderRadius:8}}>{ciMsg}</div>}
              </div>
            </Card>
            <Card>
              <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Check-In History</div>
              {checkins.length===0?<div style={{color:C.muted,fontSize:12}}>No check-ins yet.</div>:(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(75px,1fr))',gap:6}}>
                  {checkins.slice(0,8).map(ci=>(
                    <div key={ci.id} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px',textAlign:'center'}}>
                      <div style={{fontSize:10,color:C.muted}}>{ci.week_date}</div>
                      {ci.weight_lbs&&<div style={{fontSize:12,fontWeight:700}}>{ci.weight_lbs}</div>}
                      {ci.sprint_40m&&<div style={{fontSize:11,color:C.muted}}>{ci.sprint_40m}s</div>}
                      <div style={{fontSize:11,color:(ci.days_trained||ci.days_completed||0)>=5?C.teal:C.amber}}>{ci.days_trained||ci.days_completed||0}/7d</div>
                      {ci.minutes_played&&<div style={{fontSize:10,color:C.muted}}>{ci.minutes_played}min</div>}
                    </div>
                  ))}
                </div>
              )}
              {checkins[0]?.adjustments?.length>0&&<>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,margin:'10px 0 6px',textTransform:'uppercase',letterSpacing:'.6px'}}>This week's adjustments</div>
                {checkins[0].adjustments.map((a,i)=>(
                  <div key={i} style={{background:C.amberLt,border:`1px solid ${C.amber}`,borderRadius:8,padding:'7px 10px',marginBottom:5,fontSize:12}}>
                    <div style={{fontWeight:700}}>{a.t}</div><div style={{color:C.muted,marginTop:2}}>{a.d}</div>
                  </div>
                ))}
              </>}
            </Card>
          </div>
        </>}

        {/* ══ PROGRESS ══ */}
        {tab==='progress'&&<>
          <Sh>Performance Index — Your Development Profile</Sh>
          <Hbox color="blue">This is your personal development profile — not a competition. Track your own growth over time.</Hbox>
          <Card style={{marginTop:8}}>
            <PerformanceRadar {...perfIndex} attendance={upcomingEvents.length>0?Math.round((Object.values(myAttendance).filter(a=>a.status==='Confirmed').length/Math.max(upcomingEvents.length,1))*100):null}/>
          </Card>

          <Sh>Position KPIs — {pos.label}</Sh>
          <Card>
            {pos.kpis.map(kpi=>(
              <div key={kpi} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:pos.color,display:'inline-block',flexShrink:0}}></span>
                <span>{kpi}</span>
              </div>
            ))}
          </Card>

          <Sh>Sprint Progress</Sh>
          <Card>
            {checkins.length===0?<div style={{color:C.muted,fontSize:12}}>Complete check-ins to track sprint progress.</div>:(
              <TblWrap>
                <thead><tr><Th>Date</Th><Th>40m Sprint</Th><Th>Weight</Th><Th>Days Trained</Th><Th>Min Played</Th></tr></thead>
                <tbody>{checkins.slice(0,8).map((ci,i)=>(
                  <tr key={ci.id} style={{background:i%2===0?C.bg:'white'}}>
                    <Td>{ci.week_date}</Td>
                    <Td hl>{ci.sprint_40m?`${ci.sprint_40m}s`:'—'}</Td>
                    <Td>{ci.weight_lbs?`${ci.weight_lbs} lbs`:'—'}</Td>
                    <Td>{ci.days_trained||ci.days_completed||'—'}/7</Td>
                    <Td>{ci.minutes_played||'—'}</Td>
                  </tr>
                ))}</tbody>
              </TblWrap>
            )}
          </Card>

          <Sh>Game Performance Trend</Sh>
          {games.length===0?<div style={{color:C.muted,fontSize:13}}>Log games to track match performance.</div>:(
            <Card>
              <TblWrap>
                <thead><tr><Th>Date</Th><Th>Opponent</Th><Th>Min</Th>{pos.gameStats.slice(0,3).map(k=><Th key={k}>{pos.gameStatLabels[k]}</Th>)}<Th>Rating</Th></tr></thead>
                <tbody>{games.slice(0,8).map((g,i)=>(
                  <tr key={g.id} style={{background:i%2===0?C.bg:'white'}}>
                    <Td>{g.game_date}</Td><Td>{g.opponent||'—'}</Td><Td>{g.minutes_played}'</Td>
                    {pos.gameStats.slice(0,3).map(k=><Td key={k}>{g.stats?.[k]??'—'}</Td>)}
                    <Td><span style={{fontWeight:700,color:g.self_rating>=8?C.teal:g.self_rating>=6?C.amber:C.red}}>{g.self_rating||'—'}</span></Td>
                  </tr>
                ))}</tbody>
              </TblWrap>
            </Card>
          )}
        </>}

      </div>
    </div>
  );
}
