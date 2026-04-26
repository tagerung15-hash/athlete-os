// src/views/TacticsView.jsx
// Full team tactics — shown to every player regardless of position

const C = {
  bg:'#F8F8F6',card:'#fff',border:'#E0DED7',text:'#18181A',muted:'#6B6A66',
  teal:'#1D9E75',tealDk:'#085041',tealLt:'#E1F5EE',
  blue:'#185FA5',blueDk:'#0C447C',blueLt:'#E6F1FB',
  amber:'#BA7517',amberLt:'#FAEEDA',
  red:'#E24B4A',redLt:'#FCEBEB',
  purple:'#5B3FA8',purpleLt:'#EEEDFE',
};

function Sh({children}) {
  return <div style={{fontSize:'10px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'.8px',color:C.muted,margin:'1.25rem 0 .4rem',borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>{children}</div>;
}
function Card({children,style}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.1rem',marginBottom:'.75rem',...style}}>{children}</div>;
}
function Hbox({color='green',children}) {
  const map={green:[C.tealLt,C.teal,C.tealDk],amber:[C.amberLt,C.amber,C.amber],blue:[C.blueLt,C.blue,C.blueDk],red:[C.redLt,C.red,'#7A1F1F'],purple:[C.purpleLt,C.purple,C.purple]};
  const [bg,brd,clr]=map[color]||map.green;
  return <div style={{background:bg,borderLeft:`3px solid ${brd}`,color:clr,borderRadius:'0 6px 6px 0',padding:'7px 11px',marginTop:8,fontSize:12,lineHeight:1.6}}>{children}</div>;
}
function TblWrap({children}) {
  return <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>{children}</table></div>;
}
function Th({children}) { return <th style={{background:C.bg,padding:'7px 9px',textAlign:'left',fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,whiteSpace:'nowrap'}}>{children}</th>; }
function Td({children,hl}) { return <td style={{padding:'6px 9px',borderBottom:`1px solid ${C.border}`,fontWeight:hl?700:'normal',verticalAlign:'top'}}>{children}</td>; }

function Section({icon, title, color, children}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',marginBottom:'.75rem'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'.75rem 1rem',background:C.bg,borderBottom:`1px solid ${C.border}`,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:18}}>{icon}</span>
          <span style={{fontSize:14,fontWeight:700}}>{title}</span>
        </div>
        <span style={{color:C.muted,transition:'transform .2s',transform:open?'rotate(180deg)':'rotate(0)'}}>▼</span>
      </div>
      {open && <div style={{padding:'1rem 1.1rem'}}>{children}</div>}
    </div>
  );
}

import React, { useState } from 'react';

const TABS = ['movement','pressing','defending','attacking','setpieces'];
const TAB_LABELS = {movement:'Movement',pressing:'Pressing',defending:'Defending',attacking:'Attacking',setpieces:'Set Pieces'};

export default function TacticsView() {
  const [tab, setTab] = useState('movement');

  return (
    <div style={{padding:'1.25rem',maxWidth:1100,margin:'0 auto'}}>
      <div style={{marginBottom:'1rem'}}>
        <h2 style={{fontSize:16,fontWeight:800,marginBottom:4}}>Team Tactics Library</h2>
        <p style={{fontSize:13,color:C.muted}}>Universal — applies to every player regardless of position. Study these weekly.</p>
      </div>

      <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:'1rem'}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${tab===t?C.blue:C.border}`,background:tab===t?C.blue:'white',color:tab===t?'white':C.muted,fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ===== MOVEMENT ===== */}
      {tab==='movement' && <>
        <Sh>In-Ball Movement — When Your Team Has Possession</Sh>
        <Section icon="🔵" title="Creating and Using Width">
          <p style={{fontSize:13,marginBottom:10}}>Width is the foundation of possession football. When your team has the ball, width stretches the opposition and creates space centrally.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Role</Th><Th>Responsibility</Th><Th>Cue</Th></tr></thead>
            <tbody>
              <tr><Td hl>Wingers / Full Backs</Td><Td>Hug the touchline — maximum width</Td><Td>If there is space on the outside of the last defender, you are not wide enough</Td></tr>
              <tr><Td hl>Central Midfielders</Td><Td>Occupy the half-spaces (between center and wide players)</Td><Td>Half-space runs in behind are your weapon. Never stand where your teammate stands.</Td></tr>
              <tr><Td hl>Striker</Td><Td>Stay central or make runs to stretch the defensive line vertically</Td><Td>Your position determines whether CBs step or hold. Use it.</Td></tr>
              <tr><Td hl>Center Backs</Td><Td>Split wide to receive and circulate</Td><Td>The wider you are when receiving, the more space you give the midfielders</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="blue">Key principle: The player with the ball should always have at least two clear passing options. If they do not — everyone without the ball is responsible for moving.</Hbox>
        </Section>

        <Section icon="🔵" title="Third-Man Combinations">
          <p style={{fontSize:13,marginBottom:10}}>Third-man runs are how you break organized defenses. Player A passes to Player B. Player C makes a run anticipating a pass from B. The defense tracks A and B — C is free.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Pattern</Th><Th>Setup</Th><Th>The Run</Th></tr></thead>
            <tbody>
              <tr><Td hl>Striker + CM + Winger</Td><Td>Striker drops to feet, CM plays one-two</Td><Td>Winger makes diagonal run in behind as the one-two releases the CM</Td></tr>
              <tr><Td hl>FB + Winger + Striker</Td><Td>Full back overlaps outside the winger</Td><Td>Striker makes a run across the CB to the back post</Td></tr>
              <tr><Td hl>CB + DM + CM</Td><Td>CB plays to DM under pressure</Td><Td>CM makes a run in behind the pressing line to receive forward</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="green">The third-man run only works if Player C moves BEFORE the ball is played. Reaction runs are too slow. Anticipation runs break defenses.</Hbox>
        </Section>

        <Section icon="🔵" title="Switching Play">
          <p style={{fontSize:13,marginBottom:10}}>Switching play moves the ball quickly from one side to the other before the defense can shift. It exploits the 2-3 seconds it takes a defensive block to reorganize.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>When to Switch</Th><Th>How</Th><Th>Who Benefits</Th></tr></thead>
            <tbody>
              <tr><Td hl>Opposition overloads one side</Td><Td>One long diagonal or two quick passes through the center</Td><Td>Weak side winger or full back in space</Td></tr>
              <tr><Td hl>Opposition midfield shifts to press</Td><Td>Play back to CB, then drive diagonally</Td><Td>The side the midfield left</Td></tr>
              <tr><Td hl>After winning second ball</Td><Td>Immediate switch before defense resets</Td><Td>Anyone on the opposite side who has not been tracked</Td></tr>
            </tbody>
          </table></TblWrap>
        </Section>

        <Sh>Off-Ball Movement — When Your Team Does Not Have Possession</Sh>
        <Section icon="⚫" title="Compactness and Shape">
          <p style={{fontSize:13,marginBottom:10}}>When out of possession the team must be compact. Space between lines must be small enough that the opposition cannot play through you.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Principle</Th><Th>What It Means</Th><Th>Your Role</Th></tr></thead>
            <tbody>
              <tr><Td hl>Vertical compactness</Td><Td>The distance between your defensive line and your striker should be 30-35m maximum</Td><Td>Everyone tracks back to maintain the block height when the ball is played backward</Td></tr>
              <tr><Td hl>Horizontal compactness</Td><Td>The block shifts as a unit toward the ball side</Td><Td>If the ball is on the right — the entire team shifts right, leaving space on the far side</Td></tr>
              <tr><Td hl>Cover and balance</Td><Td>Every player who goes to press has a covering player behind them</Td><Td>Never press unless your cover is in position first</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="amber">The most common mistake: one player pressing while others do not shift. This creates a gap. Everyone moves together or nobody presses.</Hbox>
        </Section>

        <Section icon="⚫" title="Transitions — Winning the Ball">
          <p style={{fontSize:13,marginBottom:10}}>The 3 seconds after winning possession are the most dangerous attacking moments. The opposition is disorganized. Move fast.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:13}}>
            <div style={{background:C.bg,borderRadius:8,padding:'.875rem',border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:700,marginBottom:6}}>Positive Transition (won the ball)</div>
              <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}>
                <li>Play forward immediately if option is on</li>
                <li>Forward players sprint in behind — no waiting</li>
                <li>Midfielders support at pace — not walking</li>
                <li>If forward pass is not on — retain and build</li>
              </ul>
            </div>
            <div style={{background:C.bg,borderRadius:8,padding:'.875rem',border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:700,marginBottom:6}}>Negative Transition (lost the ball)</div>
              <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}>
                <li>Nearest player presses immediately</li>
                <li>Everyone else sprints to get goal-side</li>
                <li>No standing and watching</li>
                <li>Organized shape before they can attack</li>
              </ul>
            </div>
          </div>
        </Section>
      </>}

      {/* ===== PRESSING ===== */}
      {tab==='pressing' && <>
        <Sh>Pressing Principles</Sh>
        <Card>
          <p style={{fontSize:13,marginBottom:10}}>Pressing is not about running — it is about angles, triggers, and timing. A disorganized press is worse than a mid-block.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Principle</Th><Th>What It Means</Th></tr></thead>
            <tbody>
              <tr><Td hl>Press trigger</Td><Td>Every press has a trigger — a moment when the opposition is vulnerable. Back-pass under pressure, long ball in the air, keeper with the ball at feet, head down first touch.</Td></tr>
              <tr><Td hl>Pressing angle</Td><Td>Press on a curved run to cut off the easy pass. Do not press in a straight line — that gives the opponent two options.</Td></tr>
              <tr><Td hl>Press in numbers</Td><Td>The press only works if at least two players go. One press that forces a bad pass is worth nothing if no one covers the second option.</Td></tr>
              <tr><Td hl>Rest defense</Td><Td>When the front line presses, the defensive line must hold — not follow. Someone has to stay goal-side in case the press is beaten.</Td></tr>
            </tbody>
          </table></TblWrap>
        </Card>

        <Section icon="🔴" title="High Press (GEGENPRESSING)">
          <p style={{fontSize:13,marginBottom:8}}>Press immediately after losing the ball or when the opposition are building from the back. The goal is to win the ball in the opponent's half.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Player</Th><Th>Press Responsibility</Th><Th>Key Rule</Th></tr></thead>
            <tbody>
              <tr><Td hl>Striker</Td><Td>Lead the press — trigger is the GK or CB receiving</Td><Td>Curved run to cut off the GK pass first. Force play wide or long.</Td></tr>
              <tr><Td hl>Wingers</Td><Td>Press the near CB or full back immediately</Td><Td>As the striker triggers — you must move simultaneously. Delay = press broken.</Td></tr>
              <tr><Td hl>Central Midfielders</Td><Td>Push up to press the opposition midfield</Td><Td>Cut passing lanes — do not chase the ball. Position to intercept the pass.</Td></tr>
              <tr><Td hl>Defensive Midfielder</Td><Td>Sit 5m behind the CM press — cover the space</Td><Td>If the press is beaten you are the last line before the back four.</Td></tr>
              <tr><Td hl>Full Backs</Td><Td>Press wide in support or hold shape depending on the zone</Td><Td>If your winger goes to press — you cover the space they leave.</Td></tr>
              <tr><Td hl>Center Backs</Td><Td>Hold the defensive line — do not step in unless told</Td><Td>Your job is the rest defense. You are the insurance.</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="red">High press requires every player to move simultaneously. If one player does not go — the press creates a gap instead of pressure.</Hbox>
        </Section>

        <Section icon="🟡" title="Mid Press (Triggered on Mistakes)">
          <p style={{fontSize:13,marginBottom:8}}>Sit in a mid-block and press when a trigger occurs in the middle third — poor touch, back pass under pressure, or an isolated player.</p>
          <div style={{fontSize:13,lineHeight:1.8}}>
            <p><strong>Trigger:</strong> Opposition player receives under pressure with back to goal, OR plays a back pass to the CB in the middle third.</p>
            <p style={{marginTop:8}}><strong>Response:</strong> Nearest 1-2 players press immediately. Everyone else shifts to close the second and third options. The rest of the team holds shape — no uncontrolled chase.</p>
            <p style={{marginTop:8}}><strong>Reset:</strong> If the press does not win the ball in 3 seconds — immediately drop back into shape. Do not keep chasing.</p>
          </div>
          <Hbox color="amber">The mid-press is the highest percentage press. The opposition has already advanced into your zone — they are less comfortable. The trigger is clear. Commit when you go.</Hbox>
        </Section>

        <Section icon="🟢" title="Low Block + Press Trap">
          <p style={{fontSize:13,marginBottom:8}}>Sit deep in a low block and use the touchline as an extra defender. Force the opposition wide and then trap.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Phase</Th><Th>What Happens</Th></tr></thead>
            <tbody>
              <tr><Td hl>Force wide</Td><Td>Shape the press centrally to force the opposition into wide areas. The touchline is your ally.</Td></tr>
              <tr><Td hl>Trap trigger</Td><Td>When the wide player receives with their back to goal or is forced into a tight space — both the FB and the winger close simultaneously.</Td></tr>
              <tr><Td hl>Cover the lanes</Td><Td>As the trap closes, the DM and CM cover the passing lanes back inside. The opposition has nowhere to go.</Td></tr>
              <tr><Td hl>Turnover</Td><Td>Win the ball and transition immediately. The block has held shape — you have players in position to counter.</Td></tr>
            </tbody>
          </table></TblWrap>
        </Section>
      </>}

      {/* ===== DEFENDING ===== */}
      {tab==='defending' && <>
        <Sh>Defensive Structures</Sh>
        <Section icon="🧱" title="Mid-Block (4-4-2 / 4-5-1 compact)">
          <p style={{fontSize:13,marginBottom:8}}>The mid-block is the most common defensive shape. Compact, organized, and hard to play through.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Line</Th><Th>Position</Th><Th>Job</Th></tr></thead>
            <tbody>
              <tr><Td hl>Striker (1)</Td><Td>Top of the block — center of the pitch</Td><Td>Press the ball when it comes to the CBs. Cut central passes. Channel to one side.</Td></tr>
              <tr><Td hl>Attacking Mid / Second Striker</Td><Td>Just behind the striker</Td><Td>Cover the space if the striker goes to press. Intercept passes into the opposition 10.</Td></tr>
              <tr><Td hl>Midfield Four</Td><Td>Horizontal line — shift with the ball</Td><Td>Shift as a unit. Do not let gaps appear between players. Wingers tuck in to protect half-spaces.</Td></tr>
              <tr><Td hl>Back Four</Td><Td>Flat line — hold depth</Td><Td>Hold the line. Do not step out unless the ball comes directly to a forward. Communicate constantly.</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="blue">The mid-block works because it denies space between the lines. If you are defending — stay in your horizontal line. Do not jump to press without a trigger.</Hbox>
        </Section>

        <Section icon="🧱" title="Low Block (Protecting a Lead)">
          <p style={{fontSize:13,marginBottom:8}}>Used when protecting a lead with limited time remaining. Everyone behind the ball. Compact. Disciplined.</p>
          <div style={{fontSize:13,lineHeight:1.9}}>
            <p><strong>Shape:</strong> Two banks of four — midfield and defense — with the striker as a lone outlet. No one pushes forward.</p>
            <p style={{marginTop:6}}><strong>Key rules:</strong> Block shots. Do not dive in. Stay on your feet. Win headers. Clear second balls long and wide.</p>
            <p style={{marginTop:6}}><strong>Transition:</strong> If you win the ball — play it long to the striker and hold your shape. Do not try to build from the back.</p>
            <p style={{marginTop:6}}><strong>Set pieces:</strong> Extra attention on corners and free kicks. Two players on the posts. Everyone marking. No passenger.</p>
          </div>
          <Hbox color="amber">The low block only breaks down when players get impatient and step out. Stay disciplined. Force them to try something from outside the box.</Hbox>
        </Section>

        <Section icon="🧱" title="Man-Marking vs Zonal">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:13}}>
            <div style={{background:C.bg,borderRadius:8,padding:'.875rem',border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:700,marginBottom:6}}>Zonal Marking</div>
              <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}>
                <li>You own a zone — defend the space, not a player</li>
                <li>Better for aerial duels at corners — you attack the ball</li>
                <li>Does not get dragged out of position by decoy runs</li>
                <li>Requires discipline and communication</li>
              </ul>
            </div>
            <div style={{background:C.bg,borderRadius:8,padding:'.875rem',border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:700,marginBottom:6}}>Man Marking</div>
              <ul style={{paddingLeft:'1rem',lineHeight:2,color:C.muted}}>
                <li>You shadow a specific opponent throughout</li>
                <li>Effective against a specific threat player</li>
                <li>Risk: you can be dragged out of position</li>
                <li>Used when one opponent is significantly better</li>
              </ul>
            </div>
          </div>
        </Section>
      </>}

      {/* ===== ATTACKING ===== */}
      {tab==='attacking' && <>
        <Sh>Attacking Structures</Sh>
        <Section icon="⚡" title="Build-Up Play (Playing Out from the Back)">
          <p style={{fontSize:13,marginBottom:8}}>Build-up starts with the goalkeeper and center backs. The goal is to move the ball through lines under pressure to reach the midfield and attack.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Phase</Th><Th>Shape</Th><Th>Key Movements</Th></tr></thead>
            <tbody>
              <tr><Td hl>GK + CB start</Td><Td>CBs split wide. GK central.</Td><Td>Create a triangle. Give the CB angles. DM drops between CBs as the extra option.</Td></tr>
              <tr><Td hl>Wide progression</Td><Td>Full backs push high</Td><Td>As CB has time — full back goes high to receive in space and drive forward.</Td></tr>
              <tr><Td hl>Central progression</Td><Td>DM receives centrally</Td><Td>DM plays quickly to the CM who is checking into space. CM then plays forward.</Td></tr>
              <tr><Td hl>Final third entry</Td><Td>Wingers wide, striker drops</Td><Td>Striker drops to receive. Wingers make runs in behind. CM arrives late into the box.</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="green">Build-up requires calm and patience. Do not rush. If there is no forward option — play back and reset. A back pass is not a failure. It is waiting for the right moment.</Hbox>
        </Section>

        <Section icon="⚡" title="Two-Thirds Play (Midfield Combination)">
          <p style={{fontSize:13,marginBottom:8}}>Two-thirds play means building in the central and wide areas outside the final third. The goal is to create overloads and find openings before committing to the attack.</p>
          <div style={{fontSize:13,lineHeight:1.9}}>
            <p><strong>Overloads:</strong> Create a 2v1 or 3v2 in wide areas using combinations between the winger, full back, and central midfielder.</p>
            <p style={{marginTop:6}}><strong>Half-space exploitation:</strong> The central midfielder makes runs into the half-spaces (the areas between the wide player and the center) to receive in dangerous positions.</p>
            <p style={{marginTop:6}}><strong>Patience:</strong> Do not force the ball into the final third until the overload is created. Premature entry gives the ball to an organized defense.</p>
          </div>
        </Section>

        <Section icon="⚡" title="Final Third Play — Breaking Down the Defense">
          <p style={{fontSize:13,marginBottom:8}}>The final third is where decisions must be fast and movement must be precise. Every player must know their role.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Scenario</Th><Th>Movement</Th><Th>Goal</Th></tr></thead>
            <tbody>
              <tr><Td hl>Defense is high and organized</Td><Td>Fake runs to stretch, then a diagonal in behind</Td><Td>Create space with movement before the pass</Td></tr>
              <tr><Td hl>Defense is sitting deep</Td><Td>Play wide, pull a defender, play into the space they left</Td><Td>Force a defensive decision and exploit it</Td></tr>
              <tr><Td hl>Defense is in transition</Td><Td>Play forward immediately — do not hold</Td><Td>Attack before they can organize</Td></tr>
              <tr><Td hl>1v1 opportunities arise</Td><Td>Commit and go — no hesitation</Td><Td>Create a shot or a cutback for the runner</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="purple">The final third is decided in training. The combinations you drill become automatic in the game. Trust the patterns. Trust your teammates.</Hbox>
        </Section>

        <Section icon="⚡" title="Counter Attack">
          <p style={{fontSize:13,marginBottom:8}}>The counter attack is the fastest transition from defense to attack. It requires every player to immediately recognize the moment and react.</p>
          <div style={{fontSize:13,lineHeight:1.9}}>
            <p><strong>Trigger:</strong> Winning possession high or after a set piece. The opposition is committed forward — space is behind them.</p>
            <p style={{marginTop:6}}><strong>Forward players:</strong> Sprint in behind immediately. Do not wait for the ball. Make the run — force the defender to track.</p>
            <p style={{marginTop:6}}><strong>Ball carrier:</strong> Drive forward with pace. Play forward as soon as the option appears. Do not slow down the counter by holding the ball.</p>
            <p style={{marginTop:6}}><strong>Supporting players:</strong> Sprint at pace to support the ball carrier. Do not trail. Arrive ready to finish or recycle.</p>
          </div>
          <Hbox color="red">Counters only work at speed. A counter that slows down becomes a possession sequence. If you cannot play forward in 3 seconds — retain and build instead.</Hbox>
        </Section>
      </>}

      {/* ===== SET PIECES ===== */}
      {tab==='setpieces' && <>
        <Sh>Attacking Set Pieces</Sh>
        <Section icon="🎯" title="Corner Kicks — Attacking">
          <p style={{fontSize:13,marginBottom:8}}>Corners are high-percentage scoring opportunities. Every player must know exactly where to be.</p>
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Player</Th><Th>Starting Position</Th><Th>Run</Th></tr></thead>
            <tbody>
              <tr><Td hl>Target player (tallest CB or ST)</Td><Td>Near post — block setup position</Td><Td>Near post dummy then attack the far post ball</Td></tr>
              <tr><Td hl>Second runner</Td><Td>Top of the box</Td><Td>Attack the second ball — most corners produce a rebound</Td></tr>
              <tr><Td hl>Third runner</Td><Td>Far post</Td><Td>Peel to far post late — hardest run for defenders to track</Td></tr>
              <tr><Td hl>Blockers (2)</Td><Td>6-yard box blocking defenders</Td><Td>Hold position to free up the target player</Td></tr>
              <tr><Td hl>Edge of box (2)</Td><Td>18-yard box perimeter</Td><Td>Shoot any clearance. Do not come inside until the ball is cleared.</Td></tr>
              <tr><Td hl>Rest defense (2)</Td><Td>Halfway line</Td><Td>Stay — cover the counter immediately if the corner is cleared</Td></tr>
            </tbody>
          </table></TblWrap>
        </Section>

        <Section icon="🎯" title="Free Kicks — Attacking">
          <div style={{fontSize:13,lineHeight:1.9}}>
            <p><strong>Direct (shooting range):</strong> Wall blocker takes the touch if needed. Shooter aims to the keeper's weak side. Curve around or over the wall.</p>
            <p style={{marginTop:6}}><strong>Indirect (wider):</strong> Two-man routine — one fakes, one crosses. Far post runner + near post runner. Second ball player at edge of box.</p>
            <p style={{marginTop:6}}><strong>Short option:</strong> If the defense is disorganized — short pass, drive into space, shoot or cross. Always have a short option available as a decoy.</p>
          </div>
        </Section>

        <Sh>Defensive Set Pieces</Sh>
        <Section icon="🛡" title="Corner Kicks — Defending">
          <TblWrap><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr><Th>Player</Th><Th>Position</Th><Th>Job</Th></tr></thead>
            <tbody>
              <tr><Td hl>Goalkeeper</Td><Td>Centrally, 1-2 yards off line</Td><Td>Dominate everything you can reach. Call early and loud.</Td></tr>
              <tr><Td hl>Near post defender</Td><Td>Near post</Td><Td>Cover the near post. Punch anything that beats the keeper on this side.</Td></tr>
              <tr><Td hl>Far post defender</Td><Td>Far post</Td><Td>Cover the far post. Last line if the keeper is beaten across.</Td></tr>
              <tr><Td hl>Zonal markers (4)</Td><Td>6-yard box zones</Td><Td>Attack the ball in your zone. Do not stand — anticipate and move to the ball.</Td></tr>
              <tr><Td hl>Man marker (1)</Td><Td>On the opposition target player</Td><Td>Shadow the biggest threat. Front them — get between them and the ball.</Td></tr>
              <tr><Td hl>Edge of box (2)</Td><Td>18-yard box</Td><Td>Shoot any clearance. Do not come inside until the ball is cleared.</Td></tr>
            </tbody>
          </table></TblWrap>
          <Hbox color="blue">Communication is the most important factor in set piece defending. Call constantly. Everyone must know where the threat is.</Hbox>
        </Section>

        <Section icon="🛡" title="Free Kick Defense">
          <div style={{fontSize:13,lineHeight:1.9}}>
            <p><strong>Wall setup:</strong> 4-5 players in the wall depending on distance. Tallest players on the near post side. Line up on the keeper's command.</p>
            <p style={{marginTop:6}}><strong>Wall discipline:</strong> Do not jump early. Jump as the ball is struck — not before. An early jump wastes the wall's purpose.</p>
            <p style={{marginTop:6}}><strong>Second ball:</strong> 2 players must be ready for the second ball outside the wall. Most free kicks produce rebounds — be ready.</p>
            <p style={{marginTop:6}}><strong>Short free kick:</strong> If the opposition plays short — the nearest player presses immediately and others shift to cover passing lanes.</p>
          </div>
        </Section>
      </>}
    </div>
  );
}
