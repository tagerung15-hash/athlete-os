// src/views/ScheduleView.jsx
import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getAttendanceForEvent, getPlayersByTeam } from '../lib/supabase';

function fmt12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

const C = {
  bg:'#F8F8F6',card:'#fff',border:'#E0DED7',text:'#18181A',muted:'#6B6A66',
  teal:'#1D9E75',tealDk:'#085041',tealLt:'#E1F5EE',
  blue:'#185FA5',blueDk:'#0C447C',blueLt:'#E6F1FB',
  amber:'#BA7517',amberLt:'#FAEEDA',
  red:'#E24B4A',redLt:'#FCEBEB',
};

const EVENT_TYPES = ['Practice','Game','Team Meeting','Recovery Session'];
const INTENSITY_LEVELS = ['Low','Moderate','High','Match'];
const STATUS_COLORS = {
  Confirmed: [C.teal, C.tealLt],
  Maybe: [C.amber, C.amberLt],
  Unavailable: [C.red, C.redLt],
  'Not Responded': [C.muted, C.bg],
};

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

const EMPTY_EVENT = {
  type:'Practice',title:'',opponent:'',date:'',start_time:'',end_time:'',
  location:'',field_number:'',notes:'',coach_focus:'',intensity_level:'Moderate',
  status:'Scheduled',formation:'',
};

function EventForm({onSave,onCancel,initial}) {
  const [form,setForm]=useState(initial||EMPTY_EVENT);
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));

  return (
    <Card>
      <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>{initial?.id?'Edit Event':'Create New Event'}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <div>
          <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>Event type</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:10}}>
            {EVENT_TYPES.map(t=>(
              <button key={t} onClick={()=>f('type',t)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${form.type===t?C.blue:C.border}`,background:form.type===t?C.blue:'white',color:form.type===t?'white':C.muted,fontSize:12,cursor:'pointer',fontWeight:form.type===t?700:400}}>{t}</button>
            ))}
          </div>
          <Inp label="Title" placeholder={form.type==='Game'?'e.g. League Game vs FC Rivals':'e.g. Pre-Match Training'} value={form.title} onChange={e=>f('title',e.target.value)}/>
          {form.type==='Game'&&<Inp label="Opponent" placeholder="e.g. FC Rivals" value={form.opponent} onChange={e=>f('opponent',e.target.value)}/>}
          <Inp label="Date" type="date" value={form.date} onChange={e=>f('date',e.target.value)}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            <Inp label="Start time" type="time" value={form.start_time} onChange={e=>f('start_time',e.target.value)}/>
            <Inp label="End time" type="time" value={form.end_time} onChange={e=>f('end_time',e.target.value)}/>
          </div>
          <Inp label="Location" placeholder="e.g. Main Training Ground" value={form.location} onChange={e=>f('location',e.target.value)}/>
          <Inp label="Field / pitch number" placeholder="e.g. Field 2" value={form.field_number} onChange={e=>f('field_number',e.target.value)}/>
        </div>
        <div>
          <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>Intensity level</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:10}}>
            {INTENSITY_LEVELS.map(lv=>{
              const colors={Low:[C.teal,C.tealLt],Moderate:[C.amber,C.amberLt],High:[C.red,C.redLt],Match:[C.blue,C.blueLt]};
              const [c,bg]=colors[lv]||[C.muted,C.bg];
              const sel=form.intensity_level===lv;
              return <button key={lv} onClick={()=>f('intensity_level',lv)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${sel?c:C.border}`,background:sel?bg:'white',color:sel?c:C.muted,fontSize:12,cursor:'pointer',fontWeight:sel?700:400}}>{lv}</button>;
            })}
          </div>
          <Inp label="Coach focus for this session" placeholder="e.g. Pressing triggers + set piece defense" value={form.coach_focus} onChange={e=>f('coach_focus',e.target.value)}/>
          {form.type==='Game'&&<Inp label="Formation" placeholder="e.g. 4-3-3" value={form.formation} onChange={e=>f('formation',e.target.value)}/>}
          <div style={{marginBottom:8}}>
            <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:3}}>Status</label>
            <select value={form.status} onChange={e=>f('status',e.target.value)} style={{width:'100%',padding:'6px 9px',borderRadius:7,border:`1px solid ${C.border}`,fontSize:13,fontFamily:'inherit',background:'white'}}>
              {['Scheduled','Canceled','Rescheduled'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:3}}>Notes / instructions</label>
            <textarea value={form.notes} onChange={e=>f('notes',e.target.value)} placeholder="e.g. Meet 30 mins early. Bring full kit." rows={4} style={{width:'100%',padding:'6px 9px',borderRadius:7,border:`1px solid ${C.border}`,fontSize:12,fontFamily:'inherit',resize:'vertical'}}/>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:4}}>
        <button onClick={async()=>{setSaving(true);await onSave(form);setSaving(false);}} disabled={saving||!form.title||!form.date} style={{padding:'8px 20px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:13,fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Event'}</button>
        <button onClick={onCancel} style={{padding:'8px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:'white',fontSize:13,cursor:'pointer'}}>Cancel</button>
      </div>
    </Card>
  );
}

function AttendancePanel({event,onClose}) {
  const [attendance,setAttendance]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    getAttendanceForEvent(event.id).then(({data})=>{setAttendance(data||[]);setLoading(false);});
  },[event.id]);

  const counts={Confirmed:0,Maybe:0,Unavailable:0,'Not Responded':0};
  attendance.forEach(a=>counts[a.status]=(counts[a.status]||0)+1);

  return (
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.1rem',marginBottom:'.75rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:800}}>{event.title}</div>
          <div style={{fontSize:12,color:C.muted}}>{event.date} · {event.start_time} · {event.location}</div>
        </div>
        <button onClick={onClose} style={{padding:'4px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:'white',fontSize:12,cursor:'pointer'}}>Close</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:14}}>
        {Object.entries(counts).map(([status,count])=>{
          const [color,bg]=STATUS_COLORS[status]||[C.muted,C.bg];
          return <div key={status} style={{background:bg,border:`1px solid ${color}20`,borderRadius:8,padding:'8px',textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:800,color}}>{count}</div>
            <div style={{fontSize:10,color,fontWeight:600}}>{status}</div>
          </div>;
        })}
      </div>

      {loading?<div style={{color:C.muted,fontSize:12}}>Loading responses...</div>:(
        <div>
          {attendance.length===0?<div style={{color:C.muted,fontSize:12}}>No responses yet. Players will see this event in their dashboard.</div>:(
            attendance.map(a=>{
              const [color,bg]=STATUS_COLORS[a.status]||[C.muted,C.bg];
              return (
                <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`0.5px solid ${C.border}`}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:bg,border:`2px solid ${color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color,flexShrink:0}}>
                    {a.players?.name?.split(' ').map(n=>n[0]).join('').slice(0,2)||'?'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700}}>{a.players?.name||'Unknown'}</div>
                    <div style={{fontSize:10,color:C.muted}}>{a.response_note||'No note added'}</div>
                  </div>
                  <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:bg,color,fontWeight:700}}>{a.status}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function ScheduleView({team,isCoach}) {
  const [events,setEvents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [editEvent,setEditEvent]=useState(null);
  const [viewAttendance,setViewAttendance]=useState(null);
  const [tab,setTab]=useState('upcoming');

  useEffect(()=>{loadEvents();},[]);

  async function loadEvents() {
    const {data}=await getEvents(team.id);
    setEvents(data||[]);
    setLoading(false);
  }

  async function handleSave(form) {
    if (editEvent?.id) {
      await updateEvent(editEvent.id,form);
    } else {
      await createEvent(team.id,form);
    }
    setShowForm(false); setEditEvent(null);
    loadEvents();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
    loadEvents();
  }

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter(e=>e.date>=today&&e.status!=='Canceled');
  const past = events.filter(e=>e.date<today||e.status==='Canceled');
  const display = tab==='upcoming'?upcoming:past;

  const typeColors = {'Practice':[C.blue,C.blueLt],'Game':[C.red,C.redLt],'Team Meeting':[C.amber,C.amberLt],'Recovery Session':[C.teal,C.tealLt]};
  const intensityColors = {'Low':C.teal,'Moderate':C.amber,'High':C.red,'Match':C.blue};

  if (loading) return <div style={{padding:'2rem',color:C.muted,textAlign:'center'}}>Loading schedule...</div>;

  return (
    <div style={{padding:'1.25rem',maxWidth:1100,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:8}}>
        <div>
          <h2 style={{fontSize:16,fontWeight:800,marginBottom:4}}>Team Schedule</h2>
          <p style={{fontSize:12,color:C.muted}}>{upcoming.length} upcoming event{upcoming.length!==1?'s':''}</p>
        </div>
        {isCoach&&!showForm&&<button onClick={()=>{setShowForm(true);setEditEvent(null);}} style={{padding:'8px 18px',borderRadius:8,border:'none',background:C.blue,color:'white',fontSize:13,fontWeight:700,cursor:'pointer'}}>+ Create Event</button>}
      </div>

      {(showForm||editEvent)&&isCoach&&(
        <EventForm initial={editEvent||EMPTY_EVENT} onSave={handleSave} onCancel={()=>{setShowForm(false);setEditEvent(null);}}/>
      )}

      {viewAttendance&&isCoach&&(
        <AttendancePanel event={viewAttendance} onClose={()=>setViewAttendance(null)}/>
      )}

      <div style={{display:'flex',gap:5,marginBottom:'1rem'}}>
        {['upcoming','past'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${tab===t?C.blue:C.border}`,background:tab===t?C.blue:'white',color:tab===t?'white':C.muted,fontSize:12,cursor:'pointer',fontWeight:tab===t?600:400,textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>

      {display.length===0&&<div style={{textAlign:'center',padding:'3rem',color:C.muted,background:C.card,borderRadius:12,border:`1px solid ${C.border}`}}>{tab==='upcoming'?'No upcoming events. Coach will add events here.':'No past events.'}</div>}

      {display.map(event=>{
        const [typeColor,typeBg]=typeColors[event.type]||[C.muted,C.bg];
        const iColor=intensityColors[event.intensity_level]||C.muted;
        const isCanceled=event.status==='Canceled';
        return (
          <div key={event.id} style={{background:C.card,border:`1px solid ${isCanceled?C.border:typeColor+'40'}`,borderRadius:12,overflow:'hidden',marginBottom:10,opacity:isCanceled?0.6:1}}>
            <div style={{padding:'12px 16px',borderLeft:`4px solid ${isCanceled?C.border:typeColor}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:700,background:typeBg,color:typeColor}}>{event.type}</span>
                    {event.intensity_level&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:700,background:`${iColor}20`,color:iColor}}>⚡ {event.intensity_level}</span>}
                    {isCanceled&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:700,background:C.redLt,color:C.red}}>Canceled</span>}
                  </div>
                  <div style={{fontSize:14,fontWeight:800}}>{event.title}{event.opponent?` vs ${event.opponent}`:''}</div>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:3}}>
                    <span style={{fontSize:12,color:C.muted}}>📅 {new Date(event.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                    {event.start_time&&<span style={{fontSize:12,color:C.muted}}>🕐 {fmt12(event.start_time)}{event.end_time?` – ${fmt12(event.end_time)}`:''}</span>}
                    {event.location&&<span style={{fontSize:12,color:C.muted}}>📍 {event.location}{event.field_number?` · ${event.field_number}`:''}</span>}
                  </div>
                  {event.coach_focus&&<div style={{fontSize:11,color:C.blueDk,marginTop:4,fontWeight:600}}>📌 {event.coach_focus}</div>}
                  {event.notes&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{event.notes}</div>}
                </div>
                {isCoach&&(
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <button onClick={()=>setViewAttendance(event)} style={{padding:'5px 10px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontSize:11,cursor:'pointer'}}>👥 Attendance</button>
                    <button onClick={()=>{setEditEvent(event);setShowForm(false);}} style={{padding:'5px 10px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontSize:11,cursor:'pointer'}}>✏️ Edit</button>
                    <button onClick={()=>handleDelete(event.id)} style={{padding:'5px 10px',borderRadius:8,border:`1px solid ${C.redLt}`,background:C.redLt,color:C.red,fontSize:11,cursor:'pointer'}}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
