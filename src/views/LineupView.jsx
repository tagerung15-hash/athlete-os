// src/views/LineupView.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { POSITIONS } from '../lib/config';

const C = {
  bg:'#F8F8F6',card:'#fff',border:'#E0DED7',text:'#18181A',muted:'#6B6A66',
  teal:'#1D9E75',tealDk:'#085041',tealLt:'#E1F5EE',
  blue:'#185FA5',blueDk:'#0C447C',blueLt:'#E6F1FB',
  amber:'#BA7517',amberLt:'#FAEEDA',
  red:'#E24B4A',redLt:'#FCEBEB',
};

// Default formation positions (x/y as 0-1 percentages of field)
const FORMATIONS = {
  '4-3-3': [
    {slot:'GK',x:.5,y:.92},{slot:'LB',x:.15,y:.75},{slot:'CB1',x:.35,y:.78},{slot:'CB2',x:.65,y:.78},{slot:'RB',x:.85,y:.75},
    {slot:'CM1',x:.25,y:.55},{slot:'DM',x:.5,y:.60},{slot:'CM2',x:.75,y:.55},
    {slot:'LW',x:.15,y:.30},{slot:'ST',x:.5,y:.22},{slot:'RW',x:.85,y:.30},
  ],
  '4-4-2': [
    {slot:'GK',x:.5,y:.92},{slot:'LB',x:.15,y:.75},{slot:'CB1',x:.35,y:.78},{slot:'CB2',x:.65,y:.78},{slot:'RB',x:.85,y:.75},
    {slot:'LM',x:.15,y:.55},{slot:'CM1',x:.37,y:.58},{slot:'CM2',x:.63,y:.58},{slot:'RM',x:.85,y:.55},
    {slot:'ST1',x:.35,y:.28},{slot:'ST2',x:.65,y:.28},
  ],
  '4-2-3-1': [
    {slot:'GK',x:.5,y:.92},{slot:'LB',x:.15,y:.75},{slot:'CB1',x:.35,y:.78},{slot:'CB2',x:.65,y:.78},{slot:'RB',x:.85,y:.75},
    {slot:'DM1',x:.35,y:.62},{slot:'DM2',x:.65,y:.62},
    {slot:'LAM',x:.2,y:.42},{slot:'CAM',x:.5,y:.40},{slot:'RAM',x:.8,y:.42},
    {slot:'ST',x:.5,y:.22},
  ],
  '3-5-2': [
    {slot:'GK',x:.5,y:.92},{slot:'CB1',x:.25,y:.78},{slot:'CB2',x:.5,y:.80},{slot:'CB3',x:.75,y:.78},
    {slot:'LWB',x:.1,y:.60},{slot:'CM1',x:.3,y:.58},{slot:'DM',x:.5,y:.62},{slot:'CM2',x:.7,y:.58},{slot:'RWB',x:.9,y:.60},
    {slot:'ST1',x:.35,y:.25},{slot:'ST2',x:.65,y:.25},
  ],
  '5-3-2': [
    {slot:'GK',x:.5,y:.92},{slot:'LB',x:.1,y:.72},{slot:'CB1',x:.28,y:.78},{slot:'CB2',x:.5,y:.80},{slot:'CB3',x:.72,y:.78},{slot:'RB',x:.9,y:.72},
    {slot:'CM1',x:.3,y:.55},{slot:'CM2',x:.5,y:.58},{slot:'CM3',x:.7,y:.55},
    {slot:'ST1',x:.35,y:.25},{slot:'ST2',x:.65,y:.25},
  ],
};

function Field({players, slotPositions, isCoach, onMove, onPlayerClick, selectedSlot, highlightPlayer}) {
  const fieldRef = useRef(null);
  const dragging = useRef(null);

  function getRelativePos(e, el) {
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) };
  }

  function onMouseMove(e) {
    if (!dragging.current || !isCoach) return;
    e.preventDefault();
    const pos = getRelativePos(e, fieldRef.current);
    onMove(dragging.current, pos.x, pos.y);
  }

  function onMouseUp() { dragging.current = null; }

  return (
    <div ref={fieldRef} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onTouchMove={onMouseMove} onTouchEnd={onMouseUp}
      style={{
        position:'relative', width:'100%', paddingBottom:'150%', background:'#2d6e2d',
        borderRadius:12, overflow:'hidden', border:'2px solid #1a4a1a', cursor: isCoach ? 'default' : 'default',
        userSelect:'none',
      }}>
      {/* Field markings */}
      <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} viewBox="0 0 100 150" preserveAspectRatio="none">
        <rect x="5" y="5" width="90" height="140" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".8"/>
        <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        <circle cx="50" cy="75" r="10" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        <circle cx="50" cy="75" r=".8" fill="rgba(255,255,255,.4)"/>
        {/* Penalty boxes */}
        <rect x="22" y="5" width="56" height="25" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        <rect x="36" y="5" width="28" height="12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        <rect x="22" y="120" width="56" height="25" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        <rect x="36" y="138" width="28" height="12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".6"/>
        {/* Goals */}
        <rect x="41" y="3" width="18" height="4" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.5)" strokeWidth=".6"/>
        <rect x="41" y="143" width="18" height="4" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.5)" strokeWidth=".6"/>
      </svg>

      {/* Players */}
      {slotPositions.map((slot, i) => {
        const player = players.find(p => p.slot === slot.slot);
        const pos = POSITIONS[player?.position];
        const isHighlighted = highlightPlayer && player?.player_id === highlightPlayer;
        const isSelected = selectedSlot === slot.slot;
        return (
          <div key={slot.slot}
            onMouseDown={e => { if (isCoach) { dragging.current = slot.slot; e.preventDefault(); }}}
            onTouchStart={e => { if (isCoach) dragging.current = slot.slot; }}
            onClick={() => onPlayerClick && onPlayerClick(slot.slot, player)}
            style={{
              position:'absolute',
              left:`${slot.x * 100}%`, top:`${slot.y * 100}%`,
              transform:'translate(-50%,-50%)',
              cursor: isCoach ? 'grab' : 'pointer',
              zIndex: isSelected || isHighlighted ? 10 : 2,
              transition: dragging.current === slot.slot ? 'none' : 'left .2s, top .2s',
            }}>
            <div style={{
              width: 38, height: 38, borderRadius:'50%',
              background: player ? (pos?.color || '#185FA5') : 'rgba(255,255,255,.2)',
              border: `2.5px solid ${isHighlighted ? '#FFD700' : isSelected ? '#fff' : 'rgba(255,255,255,.6)'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: player ? 14 : 18, boxShadow: isHighlighted ? '0 0 0 3px #FFD700' : '0 2px 8px rgba(0,0,0,.3)',
            }}>
              {player ? (player.name?.split(' ').map(n=>n[0]).join('').slice(0,2)) : '＋'}
            </div>
            <div style={{
              textAlign:'center', marginTop:2, fontSize:9, fontWeight:700,
              color:'white', textShadow:'0 1px 3px rgba(0,0,0,.8)', whiteSpace:'nowrap',
              maxWidth:60, overflow:'hidden', textOverflow:'ellipsis',
            }}>
              {player ? player.name?.split(' ')[0] : slot.slot}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LineupView({team, isCoach, currentPlayerId}) {
  const [lineups, setLineups] = useState([]);
  const [activeLineup, setActiveLineup] = useState(null);
  const [slotPositions, setSlotPositions] = useState(FORMATIONS['4-3-3']);
  const [assignments, setAssignments] = useState([]); // [{slot, player_id, name, position}]
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [formation, setFormation] = useState('4-3-3');
  const [lineupName, setLineupName] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const {data: ps} = await supabase.from('players').select('id,name,position,secondary_position').eq('team_id', team.id);
    setTeamPlayers(ps || []);
    const {data: ls} = await supabase.from('lineups').select('*').eq('team_id', team.id).order('created_at', {ascending:false});
    setLineups(ls || []);
    if (ls && ls.length > 0) loadLineup(ls[0], ps || []);
  }

  function loadLineup(lineup, players) {
    setActiveLineup(lineup);
    setLineupName(lineup.name);
    setFormation(lineup.formation || '4-3-3');
    const slots = lineup.slot_positions ? JSON.parse(lineup.slot_positions) : FORMATIONS[lineup.formation || '4-3-3'];
    setSlotPositions(slots);
    const assign = lineup.assignments ? JSON.parse(lineup.assignments) : [];
    // Enrich with player data
    const enriched = assign.map(a => {
      const p = players.find(pl => pl.id === a.player_id);
      return { ...a, name: p?.name || a.name, position: p?.position || a.position };
    });
    setAssignments(enriched);
  }

  function handleMove(slot, x, y) {
    setSlotPositions(prev => prev.map(s => s.slot === slot ? {...s, x, y} : s));
  }

  function handlePlayerClick(slot, currentPlayer) {
    if (!isCoach) return;
    setSelectedSlot(slot === selectedSlot ? null : slot);
  }

  function assignPlayer(playerId) {
    if (!selectedSlot || !isCoach) return;
    const player = teamPlayers.find(p => p.id === playerId);
    if (!player) return;
    setAssignments(prev => {
      const filtered = prev.filter(a => a.slot !== selectedSlot && a.player_id !== playerId);
      return [...filtered, {slot: selectedSlot, player_id: playerId, name: player.name, position: player.position}];
    });
    setSelectedSlot(null);
  }

  function changeFormation(f) {
    setFormation(f);
    setSlotPositions(FORMATIONS[f]);
    setAssignments([]);
  }

  async function saveLineup() {
    setSaving(true);
    const data = {
      team_id: team.id, name: lineupName || 'Lineup', formation,
      slot_positions: JSON.stringify(slotPositions),
      assignments: JSON.stringify(assignments),
    };
    if (activeLineup?.id) {
      await supabase.from('lineups').update(data).eq('id', activeLineup.id);
    } else {
      const {data: newL} = await supabase.from('lineups').insert(data).select().single();
      setActiveLineup(newL);
    }
    setMsg('Saved!');
    setTimeout(() => setMsg(''), 2000);
    setSaving(false);
    loadData();
  }

  async function createNewLineup() {
    setActiveLineup(null);
    setLineupName('New Lineup');
    setFormation('4-3-3');
    setSlotPositions(FORMATIONS['4-3-3']);
    setAssignments([]);
  }

  const mySlot = assignments.find(a => a.player_id === currentPlayerId);

  return (
    <div style={{padding:'1.25rem',maxWidth:1100,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8,marginBottom:'1rem'}}>
        <div>
          <h2 style={{fontSize:16,fontWeight:800,marginBottom:4}}>
            {isCoach ? 'Lineup Builder' : 'Team Lineup'}
          </h2>
          <p style={{fontSize:12,color:C.muted}}>
            {isCoach ? 'Drag players to position. Tap a slot then select a player.' : mySlot ? `Your position: ${mySlot.slot}` : 'Check your position for the upcoming match.'}
          </p>
        </div>
        {isCoach && (
          <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
            <select value={formation} onChange={e=>changeFormation(e.target.value)} style={{padding:'6px 10px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:12,fontFamily:'inherit'}}>
              {Object.keys(FORMATIONS).map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            <input value={lineupName} onChange={e=>setLineupName(e.target.value)} placeholder="Lineup name" style={{padding:'6px 10px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:12,width:130,fontFamily:'inherit'}}/>
            <button onClick={saveLineup} disabled={saving} style={{padding:'6px 14px',borderRadius:8,border:'none',background:C.teal,color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save'}</button>
            <button onClick={createNewLineup} style={{padding:'6px 14px',borderRadius:8,border:`1px solid ${C.border}`,background:'white',fontSize:12,cursor:'pointer'}}>+ New</button>
            {msg && <span style={{fontSize:12,color:C.teal,fontWeight:700}}>{msg}</span>}
          </div>
        )}
      </div>

      {/* Saved lineups */}
      {lineups.length > 1 && (
        <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
          {lineups.map(l=>(
            <button key={l.id} onClick={()=>loadLineup(l,teamPlayers)} style={{padding:'4px 12px',borderRadius:20,border:`1px solid ${activeLineup?.id===l.id?C.blue:C.border}`,background:activeLineup?.id===l.id?C.blue:'white',color:activeLineup?.id===l.id?'white':C.muted,fontSize:11,cursor:'pointer'}}>
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:isCoach?'1fr 280px':'1fr',gap:'1rem'}}>
        {/* Field */}
        <div>
          <Field
            players={assignments}
            slotPositions={slotPositions}
            isCoach={isCoach}
            onMove={handleMove}
            onPlayerClick={handlePlayerClick}
            selectedSlot={selectedSlot}
            highlightPlayer={currentPlayerId}
          />
        </div>

        {/* Coach sidebar */}
        {isCoach && (
          <div>
            {selectedSlot && (
              <div style={{background:C.blueLt,border:`1px solid ${C.blue}`,borderRadius:10,padding:'10px 12px',marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:800,color:C.blueDk,marginBottom:8}}>ASSIGN TO: {selectedSlot}</div>
                <div style={{maxHeight:250,overflowY:'auto'}}>
                  {teamPlayers.map(p => {
                    const pos = POSITIONS[p.position];
                    const isAssigned = assignments.find(a=>a.player_id===p.id&&a.slot!==selectedSlot);
                    return (
                      <div key={p.id} onClick={()=>assignPlayer(p.id)} style={{
                        display:'flex',alignItems:'center',gap:8,padding:'7px 8px',borderRadius:8,marginBottom:4,cursor:'pointer',
                        background:isAssigned?'#f5f4f0':'white',border:`1px solid ${C.border}`,opacity:isAssigned?.5:1,
                      }}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:pos?.color||C.blue,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'white',fontWeight:700,flexShrink:0}}>
                          {p.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div style={{fontSize:12,fontWeight:700}}>{p.name}</div>
                          <div style={{fontSize:10,color:C.muted}}>{pos?.emoji} {pos?.label}</div>
                        </div>
                        {isAssigned && <span style={{fontSize:10,color:C.muted,marginLeft:'auto'}}>in {isAssigned.slot}</span>}
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setSelectedSlot(null)} style={{width:'100%',padding:'6px',borderRadius:8,border:`1px solid ${C.border}`,background:'white',fontSize:11,cursor:'pointer',marginTop:6}}>Cancel</button>
              </div>
            )}

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px'}}>
              <div style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:8}}>SQUAD ({teamPlayers.length} players)</div>
              {teamPlayers.map(p => {
                const pos = POSITIONS[p.position];
                const slot = assignments.find(a=>a.player_id===p.id);
                return (
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:`0.5px solid ${C.border}`}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:pos?.color||C.blue,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'white',fontWeight:700,flexShrink:0}}>
                      {p.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                      <div style={{fontSize:10,color:C.muted}}>{pos?.label}</div>
                    </div>
                    <div style={{fontSize:10,color:slot?C.teal:C.muted,fontWeight:slot?700:400}}>{slot?slot.slot:'unassigned'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Player view — show their position highlight */}
      {!isCoach && assignments.length > 0 && (
        <div style={{marginTop:'1rem',background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem'}}>
          <div style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:8}}>STARTING LINEUP</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:6}}>
            {assignments.map(a => {
              const pos = POSITIONS[a.position];
              const isMe = a.player_id === currentPlayerId;
              return (
                <div key={a.slot} style={{background:isMe?C.tealLt:C.bg,border:`1px solid ${isMe?C.teal:C.border}`,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:3}}>{a.slot}</div>
                  <div style={{fontSize:12,fontWeight:700,color:isMe?C.tealDk:C.text}}>{a.name?.split(' ')[0]}</div>
                  <div style={{fontSize:10,color:C.muted}}>{pos?.emoji} {pos?.label}</div>
                  {isMe && <div style={{fontSize:10,fontWeight:800,color:C.teal,marginTop:3}}>YOU ⭐</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
