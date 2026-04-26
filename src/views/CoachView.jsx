// src/views/CoachView.jsx
import { useState, useEffect } from 'react';
import { getTeamSnapshot, updatePlayer } from '../lib/supabase';
import { POSITIONS, calcNutrition, calcScore } from '../lib/config';
import LineupView from './LineupView';

const C = {
  bg: '#F8F8F6', card: '#fff', border: '#E0DED7', text: '#18181A', muted: '#6B6A66',
  teal: '#1D9E75', tealLt: '#E1F5EE', tealDk: '#085041',
  blue: '#185FA5', blueLt: '#E6F1FB', blueDk: '#0C447C',
  red: '#E24B4A', redLt: '#FCEBEB',
  amber: '#BA7517', amberLt: '#FAEEDA',
};

function Bar({ value, color = C.blue, height = 6 }) {
  return (
    <div style={{ background: '#e0ddd7', borderRadius: 20, height, overflow: 'hidden', border: `0.5px solid ${C.border}` }}>
      <div style={{ width: `${Math.min(100, value || 0)}%`, height: '100%', background: color, borderRadius: 20, transition: 'width .5s' }} />
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? C.teal : score >= 60 ? C.amber : C.red;
  return (
    <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color, flexShrink: 0 }}>
      {score ?? '—'}
    </div>
  );
}

function PlayerCard({ player, checkins, games, onAssign }) {
  const [expanded, setExpanded] = useState(false);
  const [assignNote, setAssignNote] = useState(player.coach_note || '');
  const [assignFocus, setAssignFocus] = useState(player.coach_focus || '');
  const [saving, setSaving] = useState(false);

  const pos = POSITIONS[player.position] || POSITIONS.striker;
  const latestCI = checkins?.[0];
  const scoreData = calcScore(player, latestCI, games);
  const nutrition = calcNutrition(player);

  // Trend arrows
  const prev = checkins?.[1];
  const wtTrend = latestCI?.weight_lbs && prev?.weight_lbs
    ? latestCI.weight_lbs - prev.weight_lbs : null;
  const spTrend = latestCI?.sprint_40m && prev?.sprint_40m
    ? latestCI.sprint_40m - prev.sprint_40m : null;

  const flagged = (latestCI?.days_completed || 0) < 3 || (latestCI?.sleep_avg || 8) < 6;

  async function saveAssignment() {
    setSaving(true);
    await updatePlayer(player.id, { coach_note: assignNote, coach_focus: assignFocus });
    setSaving(false);
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${flagged ? C.red : C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      {/* Card header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: flagged ? C.redLt : C.card }} onClick={() => setExpanded(!expanded)}>
        <ScoreBadge score={scoreData.total} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{player.name}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, background: pos.colorLight, color: pos.color }}>{pos.emoji} {pos.label}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, background: C.blueLt, color: C.blue }}>{POSITIONS[player.position]?.gymPriority}</span>
            {flagged && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, background: C.redLt, color: C.red }}>⚠ Flagged</span>}
            {player.is_injured && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, background: C.redLt, color: C.red }}>🩹 Injured</span>}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
            {latestCI?.weight_lbs && <span style={{ fontSize: 12, color: C.muted }}>{latestCI.weight_lbs} lbs {wtTrend !== null && <span style={{ color: wtTrend > 0 ? C.teal : C.red }}>{wtTrend > 0 ? '↑' : '↓'}{Math.abs(wtTrend).toFixed(1)}</span>}</span>}
            {latestCI?.sprint_40m && <span style={{ fontSize: 12, color: C.muted }}>{latestCI.sprint_40m}s 40m {spTrend !== null && <span style={{ color: spTrend < 0 ? C.teal : C.red }}>{spTrend < 0 ? '↑' : '↓'}</span>}</span>}
            {latestCI?.days_completed !== undefined && <span style={{ fontSize: 12, color: C.muted }}>{latestCI.days_completed}/7 days</span>}
            {latestCI?.sleep_avg && <span style={{ fontSize: 12, color: latestCI.sleep_avg < 6.5 ? C.red : C.muted }}>{latestCI.sleep_avg}h sleep</span>}
          </div>
        </div>
        <div style={{ fontSize: 14, color: C.muted }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
          {/* Score breakdown */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: '.8px', marginBottom: 8 }}>SUPERHUMAN SCORE BREAKDOWN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Sprint', scoreData.sprint, C.blue], ['Strength', scoreData.strength, C.teal], ['Consistency', scoreData.consistency, C.amber], ['Soccer', scoreData.soccer, '#5B3FA8']].map(([label, val, color]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span>{label}</span><span style={{ fontWeight: 700 }}>{val}%</span>
                  </div>
                  <Bar value={val} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition summary */}
          <div style={{ background: C.bg, borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: C.muted, marginRight: 8 }}>Nutrition:</span>
            <span>{nutrition.calories} cal · {nutrition.protein}g protein · {nutrition.carbs}g carbs · {nutrition.fat}g fat</span>
          </div>

          {/* Game stats */}
          {games && games.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: '.8px', marginBottom: 6 }}>LAST {Math.min(3, games.length)} GAMES</div>
              {games.slice(0, 3).map(g => (
                <div key={g.id} style={{ display: 'flex', gap: 8, fontSize: 12, padding: '4px 0', borderBottom: `0.5px solid ${C.border}`, flexWrap: 'wrap' }}>
                  <span style={{ color: C.muted, minWidth: 70 }}>{g.game_date}</span>
                  <span style={{ fontWeight: 600 }}>{g.opponent || '—'}</span>
                  {Object.entries(g.stats || {}).slice(0, 4).map(([k, v]) => (
                    <span key={k} style={{ color: C.muted }}>{k.replace('_', ' ')}: <strong>{v}</strong></span>
                  ))}
                  {g.self_rating && <span style={{ color: g.self_rating >= 8 ? C.teal : g.self_rating >= 6 ? C.amber : C.red, fontWeight: 700 }}>{g.self_rating}/10</span>}
                </div>
              ))}
            </div>
          )}

          {/* Check-in trend */}
          {checkins && checkins.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: '.8px', marginBottom: 6 }}>CHECK-IN TREND (last 4)</div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {checkins.slice(0, 4).map(ci => (
                  <div key={ci.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', minWidth: 80, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: C.muted }}>{ci.week_date}</div>
                    {ci.weight_lbs && <div style={{ fontSize: 13, fontWeight: 700 }}>{ci.weight_lbs}</div>}
                    {ci.sprint_40m && <div style={{ fontSize: 11, color: C.muted }}>{ci.sprint_40m}s</div>}
                    <div style={{ fontSize: 11, color: ci.days_completed >= 5 ? C.teal : C.amber }}>{ci.days_completed}/7d</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coach assignment */}
          <div style={{ background: C.blueLt, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.blueDk, marginBottom: 8 }}>COACH ASSIGNMENT</div>
            <label style={{ fontSize: 11, color: C.blueDk, display: 'block', marginBottom: 3 }}>Weekly focus</label>
            <input value={assignFocus} onChange={e => setAssignFocus(e.target.value)} placeholder="e.g. Sprint PR week — push 40m time" style={{ width: '100%', padding: '6px 8px', borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, marginBottom: 8, fontFamily: 'inherit' }} />
            <label style={{ fontSize: 11, color: C.blueDk, display: 'block', marginBottom: 3 }}>Coach note (visible to player)</label>
            <input value={assignNote} onChange={e => setAssignNote(e.target.value)} placeholder="e.g. Work on press angles this week" style={{ width: '100%', padding: '6px 8px', borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, marginBottom: 8, fontFamily: 'inherit' }} />
            <button onClick={saveAssignment} disabled={saving} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: C.blue, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoachView({ team, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [search, setSearch] = useState('');
  const [coachTab, setCoachTab] = useState('squad');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const snap = await getTeamSnapshot(team.id);
    setData(snap);
    setLoading(false);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Loading squad data...</div>
      </div>
    </div>
  );

  const { players = [], checkinsByPlayer = {}, gamesByPlayer = {} } = data || {};

  // Score each player
  const scored = players.map(p => {
    const cis = checkinsByPlayer[p.id] || [];
    const games = gamesByPlayer[p.id] || [];
    const score = calcScore(p, cis[0], games);
    return { ...p, _score: score.total, _cis: cis, _games: games };
  });

  // Filter + sort
  let visible = scored.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'flagged') return (p._cis[0]?.days_completed || 0) < 3 || p.is_injured;
    if (filter === 'injured') return p.is_injured;
    if (filter !== 'all' && p.position !== filter) return false;
    return true;
  });
  if (sortBy === 'score') visible.sort((a, b) => b._score - a._score);
  else if (sortBy === 'name') visible.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'consistency') visible.sort((a, b) => (b._cis[0]?.days_completed || 0) - (a._cis[0]?.days_completed || 0));

  // Team averages
  const avgScore = scored.length ? Math.round(scored.reduce((s, p) => s + p._score, 0) / scored.length) : 0;
  const avgDays = scored.length && scored.some(p => p._cis[0]?.days_completed !== undefined)
    ? (scored.reduce((s, p) => s + (p._cis[0]?.days_completed || 0), 0) / scored.length).toFixed(1) : '—';
  const injuredCount = scored.filter(p => p.is_injured).length;
  const flaggedCount = scored.filter(p => (p._cis[0]?.days_completed || 0) < 3).length;

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0F2D4A,#083A5E,#0A5A8A)', color: 'white', padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .7, marginBottom: 3 }}>COACH DASHBOARD</div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{team.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, opacity: .6 }}>TEAM CODE</div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>{team.team_code}</div>
            </div>
            <button onClick={onLogout} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: 'white', fontSize: 12, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
        {/* Team stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
          {[['Players', players.length, ''],['Avg Score', avgScore, ''],['Avg Days/Wk', avgDays, ''],['Flagged', flaggedCount, flaggedCount > 0 ? C.red : '']].map(([label, val, col]) => (
            <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 4px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: col || 'white' }}>{val}</div>
              <div style={{ fontSize: 10, opacity: .6 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coach Tabs */}
      <div style={{ display:'flex',gap:4,padding:'.625rem 1.25rem',background:'white',borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:100 }}>
        {[['squad','👥 Squad'],['lineup','📋 Lineup Builder']].map(([t,l])=>(
          <button key={t} onClick={()=>setCoachTab(t)} style={{ padding:'6px 14px',borderRadius:20,border:`1px solid ${coachTab===t?C.blue:C.border}`,background:coachTab===t?C.blue:'white',color:coachTab===t?'white':C.muted,fontSize:12,fontWeight:500,cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      {coachTab==='lineup' && <LineupView team={team} isCoach={true} currentPlayerId={null}/>}

      {coachTab==='squad' && <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.25rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player..." style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, minWidth: 140, fontFamily: 'inherit' }} />
          {['all','flagged','injured',...Object.keys(POSITIONS)].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filter===f?C.blue:C.border}`, background: filter===f?C.blue:'white', color: filter===f?'white':C.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {f==='all'?'All':f==='flagged'?'⚠ Flagged':f==='injured'?'🩹 Injured':(POSITIONS[f]?.emoji+' '+POSITIONS[f]?.label)}
            </button>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, marginLeft: 'auto', fontFamily: 'inherit' }}>
            <option value="score">Sort: Score</option>
            <option value="name">Sort: Name</option>
            <option value="consistency">Sort: Consistency</option>
          </select>
          <button onClick={loadData} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', fontSize: 11, cursor: 'pointer' }}>↻ Refresh</button>
        </div>

        <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{visible.length} player{visible.length !== 1 ? 's' : ''} shown</div>

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
            {players.length === 0 ? 'No players have joined yet. Share the team code.' : 'No players match this filter.'}
          </div>
        )}

        {visible.map(p => (
          <PlayerCard key={p.id} player={p} checkins={p._cis} games={p._games} onAssign={() => {}} />
        ))}
      </div>}
    </div>
  );
}
