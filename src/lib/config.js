// src/lib/config.js — v4

export const POSITIONS = {
  striker: {
    label:'Striker',emoji:'⚽',color:'#E24B4A',colorLight:'#FCEBEB',
    tagline:'Speed · Finishing · Pressing',gymPriority:'Power + Explosive Speed',
    gymStyle:{sets:'4',reps:'5–8',rest:'2–3 min',tempo:'Explosive'},
    sprintFocus:'Acceleration + Repeat Sprint Ability',
    strengthFocus:'Lower body explosive power — Squats, RDLs, Box Jumps',
    enduranceFocus:'High-intensity intervals, press-reset-press patterns',
    agilityFocus:'L-drill, reaction sprints, deceleration + cut',
    weeklyThemes:['Acceleration','Finishing Runs','Strength Power','DELOAD','Max Velocity','Agility + Reaction','Soccer Integration','DELOAD','Game Speed','Explosive Peak','Sprint PR Week','DELOAD + Evaluate'],
    gameStats:['goals','shots','shots_on_target','press_att','press_won'],
    gameStatLabels:{goals:'Goals',shots:'Shots',shots_on_target:'Shots on Target',press_att:'Presses Attempted',press_won:'Presses Won'},
    kpis:['Goals per game','Shot accuracy %','Press win %','Sprint recovery time','Runs in behind per game'],
    nutritionMultiplier:1.0,
    carbTiming:'High carbs pre-match and post-sprint sessions. Moderate on gym days.',
    sprintSessions:[
      {phase:'Pure Speed',reps:[{dist:'30m',sets:4,effort:'95-100%',rest:'2.5 min'},{dist:'60m',sets:4,effort:'90-95%',rest:'3 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'150m',sets:3,effort:'85-90%',rest:'90s'},{dist:'100m',sets:4,effort:'88-92%',rest:'75s'}]},
      {phase:'Game Simulation',reps:[{dist:'40m dead legs',sets:6,effort:'Max',rest:'25-30s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'4×5–6',tempo:'3/1/2',focus:'Primary power — sprint and jump force'},
        {ex:'Romanian Deadlift',sets:'3×8',tempo:'3/0/1',focus:'Hamstrings + glutes — acceleration'},
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Reactive power — first step off the mark'},
        {ex:'Barbell Bench Press',sets:'3×8',tempo:'2/1/2',focus:'Upper body stability'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core — essential for striking'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability under fatigue'},
        {ex:'Nordic Hamstring Curls',sets:'3×5–6',tempo:'Eccentric slow',focus:'Hamstring injury prevention — highest evidence'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×6–10',tempo:'2/0/3',focus:'Back strength + relative strength'},
        {ex:'Bulgarian Split Squat',sets:'3×8 each',tempo:'2/1/2',focus:'Single-leg power — cuts and direction changes'},
        {ex:'Barbell Rows',sets:'3×10',tempo:'2/1/2',focus:'Upper back + posture'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability + ankle proprioception'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Side Planks',sets:'3×30s each',tempo:'Ctrl',focus:'Lateral core stability'},
      ],
      friday:[
        {ex:'Deadlift',sets:'3×5',tempo:'3/1/1',focus:'Total body strength'},
        {ex:'Leg Press',sets:'3×10',tempo:'2/1/2',focus:'Quad volume + knee stability'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring isolation + health'},
        {ex:'Single-Leg Calf Raises',sets:'3×15 each',tempo:'3/1/3',focus:'Achilles + lower leg resilience'},
        {ex:'Farmer Carries',sets:'4×30m',tempo:'Ctrl',focus:'Grip + core + total body stability'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip flexor + rotator health'},
        {ex:'Push-Ups (feet elevated)',sets:'3×15',tempo:'2/1/2',focus:'Chest + shoulder stability'},
      ],
    },
    iq:[
      {q:'GK receives a back-pass under pressure. What is your press approach?',opts:['Sprint straight at the GK','Approach curved to cut off near throw and force the long ball','Stand and wait to intercept','Press the CB who passed back'],best:1,fb:'Curved approach cuts the short option and forces the long ball your team is set for. Straight sprint gives too many angles away.'},
      {q:'You just pressed and lost the ball. CB has it, back to goal. Next 5 seconds?',opts:['Jog back and reset','Sprint back to defensive line','Counter-press immediately — they are disorganized for exactly 5 seconds','Call for a midfielder to press'],best:2,fb:'The 5-second counter-press window after losing possession is your highest-percentage chance to win it back. After 5 seconds — get back in shape.'},
      {q:'80th minute, heavy legs, 1v1 inside the box. What is your first touch?',opts:['Dribble past with raw speed','Shield and hold up','First touch away from the defender then strike','Pass back — too tired'],best:2,fb:'Heavy legs means simplify. One touch to create shooting space, commit to the finish. You have trained this scenario exhausted.'},
      {q:'You are in behind the defense, keeper coming out. What do you do?',opts:['Go around the keeper','Chip the keeper','Strike low to the far post','Slow down and compose yourself'],best:2,fb:'Far post low is the highest-percentage finish 1v1. It gives you the most target area and the keeper the most distance to cover.'},
      {q:'Your team wins possession deep. You are the furthest player forward. What run?',opts:['Drop deep to receive','Sprint in behind immediately','Make a diagonal run across the CB','Hold your position and wait'],best:2,fb:'Diagonal run across the CB exploits the transition. The defense is disorganized — your movement in behind immediately creates a threat before they recover shape.'},
    ],
  },
  winger:{
    label:'Winger',emoji:'⚡',color:'#BA7517',colorLight:'#FAEEDA',
    tagline:'Max Velocity · Agility · 1v1',gymPriority:'Speed + Elastic Power',
    gymStyle:{sets:'3–4',reps:'4–6',rest:'2–3 min',tempo:'Explosive'},
    sprintFocus:'Top-end speed + 1v1 acceleration + wide runs',
    strengthFocus:'Unilateral power — Split squats, single-leg work, plyometrics',
    enduranceFocus:'Repeated high-speed runs with full recovery between efforts',
    agilityFocus:'T-drill, box agility, direction change under pressure',
    weeklyThemes:['Top-End Speed','Dribbling + Agility','Explosive Strength','DELOAD','Max Velocity','1v1 Scenarios','Cross + Finish','DELOAD','Game Speed','Sprint PRs','Elastic Peak','DELOAD + Evaluate'],
    gameStats:['chances_created','crosses','dribbles_won','press_att','goals'],
    gameStatLabels:{chances_created:'Chances Created',crosses:'Crosses Completed',dribbles_won:'Successful Dribbles',press_att:'Recovery Runs',goals:'Goals'},
    kpis:['Dribble success %','Chances created per game','Crosses completed','Max sprint speed','Recovery run distance'],
    nutritionMultiplier:1.0,
    carbTiming:'Very high carbs on sprint/track days. Moderate on gym days.',
    sprintSessions:[
      {phase:'Pure Speed',reps:[{dist:'20m',sets:6,effort:'100%',rest:'2 min'},{dist:'40m',sets:4,effort:'95%',rest:'2.5 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'80m',sets:5,effort:'90%',rest:'75s'},{dist:'120m',sets:3,effort:'87%',rest:'90s'}]},
      {phase:'Game Simulation',reps:[{dist:'30m',sets:8,effort:'Max',rest:'20s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Power Clean (light)',sets:'4×4',tempo:'Explosive',focus:'Full-body elastic power'},
        {ex:'Bulgarian Split Squat',sets:'4×6 each',tempo:'2/1/2',focus:'Unilateral leg power for cuts and direction changes'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability + ankle proprioception'},
        {ex:'Push-Ups',sets:'3×15',tempo:'2/1/2',focus:'Upper body stability — no bulk'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×8',tempo:'2/0/2',focus:'Back strength — relative strength focus'},
        {ex:'Single-Leg Box Jump',sets:'4×5 each',tempo:'Explosive',focus:'Unilateral reactive power for 1v1 acceleration'},
        {ex:'Barbell Rows',sets:'3×10',tempo:'2/1/2',focus:'Upper back + posture'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
        {ex:'Side Planks',sets:'3×30s each',tempo:'Ctrl',focus:'Lateral core stability'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip flexibility for wide runs'},
      ],
      friday:[
        {ex:'Broad Jumps',sets:'4×5',tempo:'Explosive',focus:'Horizontal power — stride length and elasticity'},
        {ex:'Depth Jumps (from Wk8)',sets:'3×4',tempo:'Reactive',focus:'Reactive strength — first step speed'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring isolation + health'},
        {ex:'Single-Leg Calf Raises',sets:'3×15 each',tempo:'3/1/3',focus:'Achilles + lower leg elasticity'},
        {ex:'Farmer Carries',sets:'3×30m',tempo:'Ctrl',focus:'Total body stability'},
        {ex:'Glute Bridges',sets:'3×12',tempo:'2/1/2',focus:'Posterior chain + knee stability'},
        {ex:'Hip Flexor Stretch + Activation',sets:'2×60s each',tempo:'Ctrl',focus:'Sprint mechanics + injury prevention'},
      ],
    },
    iq:[
      {q:'Defender is jockeying you with their body open to the outside. What do you do?',opts:['Take the outside — it is open','Fake outside then cut inside onto your strong foot','Hold and play square','Sprint straight into them'],best:1,fb:'When a defender shows you the outside they are expecting you to take it. Fake the outside, cut inside onto your stronger foot — that is where the danger is.'},
      {q:'You receive wide with a defender closing fast. Space is in behind them. What do you do?',opts:['Cut inside immediately','One touch to set direction then drive in behind at full speed','Hold and wait for support','Play it back safe'],best:1,fb:'One touch to set direction then commit. The first step with purpose beats any defender. Hesitation is the only thing that kills this.'},
      {q:'Cross is blocked — ball comes straight back to you. What do you do?',opts:['Cross again immediately','Play back to maintain possession','Take a touch and drive inside','Shoot from distance'],best:0,fb:'Cross again immediately. Defenders are scrambling from the first cross. The second delivery before they reset is the most dangerous ball you can put in.'},
      {q:'You beat your defender but the angle is tight for a cross. What do you do?',opts:['Cross anyway from a tight angle','Cut back to reset the attack','Drive to the byline to improve the angle','Shoot from the tight angle'],best:2,fb:'Drive to the byline to improve your angle. A cross from closer to the goalline is more dangerous and harder for defenders to deal with than one from a tight angle further out.'},
      {q:'Your team is pressing high and wins the ball centrally. You are wide. What run?',opts:['Stay wide and call for it immediately','Make a diagonal run in behind to exploit the transition','Drop deep to help build out','Stand still and wait for the play to develop'],best:1,fb:'Stay wide initially to keep shape — then make your diagonal run in behind as the ball moves forward. Your width creates space, your run exploits the transition.'},
    ],
  },
  midfielder_cm:{
    label:'Central Midfielder',emoji:'🔄',color:'#185FA5',colorLight:'#E6F1FB',
    tagline:'Endurance · Work Rate · Box-to-Box',gymPriority:'Endurance + Functional Strength',
    gymStyle:{sets:'3',reps:'10–15',rest:'60–90s',tempo:'2/1/2'},
    sprintFocus:'Repeat sprint ability — 10-12km game pace with short recovery',
    strengthFocus:'Balanced strength — total body, no single weakness',
    enduranceFocus:'Zone 2 aerobic base + anaerobic interval work',
    agilityFocus:'5-10-5 shuttle, reaction changes, quick direction shifts',
    weeklyThemes:['Aerobic Base','Box-to-Box Endurance','Strength Balance','DELOAD','Tempo Intervals','Agility + Reaction','Full Integration','DELOAD','Game Fitness','Strength Peaks','Sprint Endurance','DELOAD + Evaluate'],
    gameStats:['passes','pass_acc','chances_created','distance_km','press_att'],
    gameStatLabels:{passes:'Passes',pass_acc:'Pass Completion %',chances_created:'Key Passes',distance_km:'Distance (km)',press_att:'Recoveries'},
    kpis:['Distance covered per game','Pass completion %','Key passes per game','Sprints per game','Recoveries'],
    nutritionMultiplier:1.05,
    carbTiming:'High carbs on all training days. Intra-session carbs for sessions over 60 minutes.',
    sprintSessions:[
      {phase:'Tempo Endurance',reps:[{dist:'200m',sets:6,effort:'80%',rest:'60s'},{dist:'400m',sets:3,effort:'75%',rest:'2 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'90%',rest:'30s'},{dist:'60m',sets:5,effort:'87%',rest:'45s'}]},
      {phase:'Game Simulation',reps:[{dist:'40m',sets:10,effort:'85%',rest:'20s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'3×10–12',tempo:'2/1/2',focus:'Leg endurance base + strength'},
        {ex:'Push-Ups (weighted)',sets:'3×15',tempo:'2/1/2',focus:'Upper body stability and endurance'},
        {ex:'Romanian Deadlift',sets:'3×12',tempo:'3/0/1',focus:'Posterior chain endurance'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core — 90-minute stability'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability under fatigue'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'3×10–12',tempo:'2/0/2',focus:'Back strength + relative strength'},
        {ex:'Barbell Rows',sets:'3×12',tempo:'2/1/2',focus:'Upper back + posture for 90 minutes'},
        {ex:'Bulgarian Split Squat',sets:'3×12 each',tempo:'2/1/2',focus:'Single-leg balance + stability'},
        {ex:'Side Planks',sets:'3×30s each',tempo:'Ctrl',focus:'Lateral core stability'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip health for box-to-box movement'},
        {ex:'Farmer Carries',sets:'3×30m',tempo:'Ctrl',focus:'Total body work capacity'},
      ],
      friday:[
        {ex:'Leg Press',sets:'3×15',tempo:'2/1/2',focus:'Quad endurance'},
        {ex:'Leg Curl',sets:'3×15',tempo:'2/1/2',focus:'Hamstring endurance'},
        {ex:'Single-Leg Calf Raises',sets:'3×20 each',tempo:'2/1/2',focus:'Lower leg endurance for 90 min'},
        {ex:'Glute Bridges',sets:'3×15',tempo:'2/1/2',focus:'Posterior chain + knee stability'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability'},
        {ex:'Hip Flexor Stretch + Activation',sets:'2×60s each',tempo:'Ctrl',focus:'Sprint mechanics'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability finisher'},
      ],
    },
    iq:[
      {q:'You receive between the lines with a defender tight behind you. What do you do?',opts:['Turn immediately','Check your shoulder then play a one-two to release into space','Hold and shield','Play it back safe'],best:1,fb:'Check your shoulder before you receive — you should already know what is behind you. The one-two releases you into space. Turning with someone tight loses the ball.'},
      {q:'Your team is slowing down in possession in the opposition half. What do you do?',opts:['Stay in position and wait','Make a run between the lines to force a defensive decision','Ask for the ball to feet and hold it','Drop deep to get more involved'],best:1,fb:'Movement creates decisions. A run between the lines forces the defense to react. Even if you do not get the ball — your movement opens space for someone else.'},
      {q:'The opposition breaks through your half. You are the deepest midfielder. Priority?',opts:['Chase the ball carrier','Drop in front of the center backs to cut the passing lane','Sprint to press the ball','Track the run of an oncoming midfielder'],best:1,fb:'Drop and cut the lane. You cannot outrun the counter but you can reduce the options. Getting between ball and goal makes the next pass harder — do not chase what you cannot catch.'},
      {q:'Ball at your feet in the final third. Striker is making a run in behind. What do you do?',opts:['Play it safe back to a defender','Play wide to the winger','Release the through ball into the run','Carry it forward yourself'],best:2,fb:'The through ball into the run is the highest-percentage chance creation from this position. You see it — play it. The hesitation is what kills it.'},
      {q:'Winning 1-0. Last 10 minutes. Your priority?',opts:['Press high to win it back','Control tempo — receive, face away from pressure, use the clock','Make aggressive forward runs to kill the game','Play quick forward passes to relieve pressure'],best:1,fb:'Control tempo. Receive the ball, face away from pressure, make the opponent run to you. Every second on the ball is a second off the clock. Your job is not to create — it is to close the game out.'},
    ],
  },
  midfielder_dm:{
    label:'Defensive Midfielder',emoji:'🛡',color:'#185FA5',colorLight:'#E6F1FB',
    tagline:'Physicality · Duels · Covering',gymPriority:'Strength + Explosive Endurance',
    gymStyle:{sets:'4',reps:'6–10',rest:'90s',tempo:'3/1/2'},
    sprintFocus:'Short explosive bursts + covering sprints 5-15m',
    strengthFocus:'Maximum physical presence — Deadlift, Squat, functional strength',
    enduranceFocus:'High-intensity repeat efforts with aerobic base',
    agilityFocus:'5-10-5 shuttle, tackle positioning, reaction drills',
    weeklyThemes:['Physical Base','Duel Strength','Explosive Endurance','DELOAD','Strength Peak','Aerobic Top-Up','Full Integration','DELOAD','Game Fitness','Strength PRs','Explosive Peak','DELOAD + Evaluate'],
    gameStats:['passes','tackles','interceptions','distance_km','duels_won'],
    gameStatLabels:{passes:'Passes',tackles:'Tackles Won',interceptions:'Interceptions',distance_km:'Distance (km)',duels_won:'Duels Won'},
    kpis:['Tackles per game','Interceptions per game','Duel win %','Distance covered','Recoveries per game'],
    nutritionMultiplier:1.05,
    carbTiming:'Moderate-high carbs. Extra protein for physical recovery and duel strength.',
    sprintSessions:[
      {phase:'Explosive Bursts',reps:[{dist:'10m',sets:10,effort:'100%',rest:'60s'},{dist:'20m',sets:8,effort:'97%',rest:'90s'}]},
      {phase:'Repeat Speed',reps:[{dist:'30m',sets:6,effort:'90%',rest:'40s'},{dist:'60m',sets:4,effort:'87%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'300m',sets:4,effort:'75%',rest:'90s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Deadlift',sets:'4×5',tempo:'3/1/1',focus:'Primary strength — physical dominance in duels'},
        {ex:'Barbell Back Squat',sets:'4×8',tempo:'3/1/2',focus:'Lower body strength'},
        {ex:'Push-Ups (weighted)',sets:'3×12',tempo:'2/1/2',focus:'Upper body strength for duels'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core — essential for duels'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
      ],
      thursday:[
        {ex:'Pull-Ups (weighted)',sets:'4×6–8',tempo:'2/0/3',focus:'Upper body strength for aerial duels'},
        {ex:'Barbell Rows',sets:'4×8',tempo:'2/1/2',focus:'Back power + posture'},
        {ex:'Romanian Deadlift',sets:'3×10',tempo:'3/0/1',focus:'Hamstrings + glutes'},
        {ex:'Side Planks',sets:'3×30s each',tempo:'Ctrl',focus:'Lateral core stability'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Farmer Carries',sets:'4×30m',tempo:'Ctrl',focus:'Physical presence + grip strength'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip health for defensive positioning'},
      ],
      friday:[
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Explosive covering bursts'},
        {ex:'Bulgarian Split Squat',sets:'3×10 each',tempo:'2/1/2',focus:'Single-leg strength'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring health'},
        {ex:'Single-Leg Calf Raises',sets:'4×15 each',tempo:'3/1/3',focus:'Lower leg strength'},
        {ex:'Glute Bridges',sets:'3×12',tempo:'2/1/2',focus:'Posterior chain + knee stability'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability'},
        {ex:'Hip Flexor Stretch + Activation',sets:'2×60s each',tempo:'Ctrl',focus:'Defensive positioning mechanics'},
      ],
    },
    iq:[
      {q:'Opposition striker drops deep between the lines. Do you follow or hold?',opts:['Follow the striker out immediately','Hold your position and let the CB deal with it','Step to cut the pass before it reaches them','Drop into the defensive line'],best:0,fb:'Follow. Your job is to neutralize the 10 or false 9. If you hold, they receive with time. Press tight or cut the pass — and communicate with the CB behind you.'},
      {q:'You have the ball in your own half with time. Priority?',opts:['Drive forward with the ball','Play it quickly to the nearest forward','Scan before you receive — find the free player','Play it back to the goalkeeper'],best:2,fb:'Scan before you receive. By the time the ball arrives you should already know where the free player is. The DM is the pivot — move the ball quickly to the right place.'},
      {q:'Opposition wins ball and plays forward. You are between ball and defense. What do you do?',opts:['Back off and drop into the line','Press immediately','Position to cut the forward pass and force them wide','Sprint to try to intercept'],best:2,fb:'Cut the forward pass and force wide. You cannot win it immediately without getting beaten. Slow the attack, make them go wide where your team can recover shape.'},
      {q:'You win a duel in midfield. Ball falls loose. What do you do?',opts:['Play the first safe pass you see','Shield and wait for support','Look up immediately and play forward if the option is on','Clear it long'],best:2,fb:'Win the duel, look up immediately. Opposition is disorganized for 2-3 seconds after losing the ball. A forward pass in this moment turns defense into attack.'},
      {q:'Opposition is playing through your midfield line consistently. What do you adjust?',opts:['Press harder individually','Drop into a compact midblock shape','Try to go man-to-man','Keep your current shape and hope it changes'],best:1,fb:'Drop into a midblock. If they are playing through you it means you are too high and spread. Compact the space, shorten passing lanes, force them wide or long.'},
    ],
  },
  defender_cb:{
    label:'Centre Back',emoji:'🧱',color:'#5B3FA8',colorLight:'#EEEDFE',
    tagline:'Strength · Aerial · Organizing',gymPriority:'Maximum Strength + Power',
    gymStyle:{sets:'4–5',reps:'4–8',rest:'2–3 min',tempo:'3/1/2'},
    sprintFocus:'Explosive 5-20m bursts + recovery sprints to cover',
    strengthFocus:'Maximum strength — Deadlift, Squat, upper body power for aerials',
    enduranceFocus:'Moderate aerobic base, high-intensity short interval work',
    agilityFocus:'Backpedal + plant, T-drill, aerial jump positioning',
    weeklyThemes:['Strength Foundation','Aerial Dominance','Short-Burst Speed','DELOAD','Max Strength','Defensive Agility','Full Integration','DELOAD','Game Fitness','Strength Peak','Explosive Power','DELOAD + Evaluate'],
    gameStats:['tackles','interceptions','clearances','aerial_won','pass_acc'],
    gameStatLabels:{tackles:'Tackles Won',interceptions:'Interceptions',clearances:'Clearances',aerial_won:'Aerials Won',pass_acc:'Pass Completion %'},
    kpis:['Aerial duel win %','Tackles per game','Clearances per game','Pass completion %','Blocks per game'],
    nutritionMultiplier:1.02,
    carbTiming:'Moderate carbs. Protein-forward on heavy strength days.',
    sprintSessions:[
      {phase:'Explosive Power',reps:[{dist:'10m',sets:8,effort:'100%',rest:'90s'},{dist:'20m',sets:6,effort:'97%',rest:'2 min'}]},
      {phase:'Recovery Sprints',reps:[{dist:'30m',sets:5,effort:'90%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'200m',sets:4,effort:'75%',rest:'90s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Deadlift',sets:'5×4–5',tempo:'3/1/1',focus:'Maximum strength — physical dominance in aerial and ground duels'},
        {ex:'Barbell Back Squat',sets:'4×6',tempo:'3/1/2',focus:'Lower body max strength'},
        {ex:'Push-Ups (weighted)',sets:'4×10',tempo:'2/1/2',focus:'Upper body power for aerial contests'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core — defensive stability'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
      ],
      thursday:[
        {ex:'Pull-Ups (weighted)',sets:'5×5–8',tempo:'2/0/3',focus:'Back strength for aerial contests'},
        {ex:'Barbell Rows',sets:'4×6–8',tempo:'2/1/2',focus:'Upper back power + posture'},
        {ex:'Romanian Deadlift',sets:'3×8',tempo:'3/0/1',focus:'Posterior chain strength'},
        {ex:'Side Planks',sets:'3×40s each',tempo:'Ctrl',focus:'Lateral core — defensive positioning'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Farmer Carries',sets:'4×30m',tempo:'Ctrl',focus:'Total body stability + grip'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip health for defensive movement'},
      ],
      friday:[
        {ex:'Box Jumps (max height)',sets:'5×4',tempo:'Explosive',focus:'Vertical explosive power for high balls'},
        {ex:'Bulgarian Split Squat',sets:'4×8 each',tempo:'2/1/2',focus:'Single-leg strength + stability'},
        {ex:'Leg Curl',sets:'3×10',tempo:'2/1/2',focus:'Hamstring health'},
        {ex:'Single-Leg Calf Raises',sets:'4×15 each',tempo:'3/1/3',focus:'Lower leg strength'},
        {ex:'Glute Bridges',sets:'3×12',tempo:'2/1/2',focus:'Posterior chain activation'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability + ankle proprioception'},
        {ex:'Hip Flexor Stretch + Activation',sets:'2×60s each',tempo:'Ctrl',focus:'Defensive positioning mechanics'},
      ],
    },
    iq:[
      {q:'Striker drops deep to receive. Do you follow or hold your line?',opts:['Follow the striker all the way out','Hold your line and let the DM deal with it','Step and press the striker on the turn','Drop into a deeper block'],best:1,fb:'Hold your line. The DM handles the press. Your job is to hold shape and cover the space in behind. If you follow the striker out you open the channel for a run behind you.'},
      {q:'Striker is in behind you and the keeper is coming out. What do you do?',opts:['Sprint to catch up at all costs','Slow to delay the striker and wait for help','Give up on the chase','Attempt a tackle from behind'],best:1,fb:'Delay. You cannot catch a striker in behind but you can slow them down. Get goal-side, delay until your keeper is set or a teammate recovers. Your angle matters more than your pace.'},
      {q:'Keeper plays it to you under pressure. Striker closing fast. What do you do?',opts:['Clear it long immediately','Play back to the keeper','Scan and find the free player before the press arrives','Carry it under pressure'],best:2,fb:'Scan before you receive. You should know where the free player is before the ball arrives. If not comfortable — play back to the keeper. Never clear blindly when under control.'},
      {q:'Defending a corner. What is your job?',opts:['Man mark tightly everywhere','Hold your zone and attack the ball','Follow your player everywhere regardless','Stand on the goal line'],best:1,fb:'Attack the ball in your zone. Whether zonal or man-marking — your job is to win your header. Get to the ball first. Passive defending at set pieces is how goals are conceded.'},
      {q:'Ball played over the top. You and the striker are racing. What do you do?',opts:['Win the foot race at all costs','Get goal-side and let the keeper come','Head it clear regardless of the keeper','Wait and see what happens'],best:1,fb:'Get goal-side and communicate with your keeper. Do not gamble — if you miss the header you play the striker clean through. Goal-side positioning forces them wide or through the keeper.'},
    ],
  },
  defender_fb:{
    label:'Full Back',emoji:'🔀',color:'#5B3FA8',colorLight:'#EEEDFE',
    tagline:'Endurance · Speed · Overlaps',gymPriority:'Endurance + Functional Power',
    gymStyle:{sets:'3–4',reps:'8–12',rest:'90s',tempo:'2/1/2'},
    sprintFocus:'Repeated high-speed runs down the flank — overlap then recovery',
    strengthFocus:'Balanced power — lower body endurance + single-leg stability',
    enduranceFocus:'High total distance + sprint recovery ability across 90 minutes',
    agilityFocus:'Direction change, overlap timing, defensive transition speed',
    weeklyThemes:['Aerobic Base','Overlap Speed','Strength Balance','DELOAD','Repeat Speed','Defensive Agility','Full Integration','DELOAD','Game Fitness','Sprint PRs','Endurance Peak','DELOAD + Evaluate'],
    gameStats:['tackles','crosses','chances_created','distance_km','dribbles_won'],
    gameStatLabels:{tackles:'Tackles Won',crosses:'Crosses Completed',chances_created:'Chances Created',distance_km:'Distance (km)',dribbles_won:'Overlaps Completed'},
    kpis:['Distance covered per game','Crosses completed','Tackles per game','Sprint recovery time','Overlaps completed'],
    nutritionMultiplier:1.05,
    carbTiming:'High carbs on sprint and track days. Moderate on gym days.',
    sprintSessions:[
      {phase:'Flank Speed',reps:[{dist:'40m',sets:5,effort:'95%',rest:'2 min'},{dist:'60m',sets:3,effort:'90%',rest:'2.5 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'88%',rest:'35s'},{dist:'50m',sets:5,effort:'85%',rest:'45s'}]},
      {phase:'Game Simulation',reps:[{dist:'40m',sets:8,effort:'Max',rest:'25s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'4×8',tempo:'3/1/2',focus:'Leg power for overlap runs and recovery'},
        {ex:'Romanian Deadlift',sets:'3×10',tempo:'3/0/1',focus:'Hamstrings for repeated sprint recovery'},
        {ex:'Push-Ups',sets:'3×15',tempo:'2/1/2',focus:'Upper body stability'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×8–10',tempo:'2/0/2',focus:'Back strength'},
        {ex:'Barbell Rows',sets:'3×10',tempo:'2/1/2',focus:'Upper back + posture'},
        {ex:'Bulgarian Split Squat',sets:'3×10 each',tempo:'2/1/2',focus:'Single-leg power + stability for overlap runs'},
        {ex:'Side Planks',sets:'3×30s each',tempo:'Ctrl',focus:'Lateral core stability'},
        {ex:'Band External Rotations',sets:'2×15 each',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Farmer Carries',sets:'3×30m',tempo:'Ctrl',focus:'Total body stability'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip health for wide runs'},
      ],
      friday:[
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Explosive first step on overlap runs'},
        {ex:'Leg Press',sets:'3×12',tempo:'2/1/2',focus:'Quad endurance for 90 min'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring endurance'},
        {ex:'Single-Leg Calf Raises',sets:'4×20 each',tempo:'2/1/2',focus:'Lower leg endurance — critical for full backs'},
        {ex:'Glute Bridges',sets:'3×15',tempo:'2/1/2',focus:'Posterior chain + knee stability'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability'},
        {ex:'Hip Flexor Stretch + Activation',sets:'2×60s each',tempo:'Ctrl',focus:'Sprint mechanics for overlapping runs'},
      ],
    },
    iq:[
      {q:'You push forward on an overlap and your team loses the ball. What do you do?',opts:['Keep pushing — you might get it back','Sprint back immediately to get goal-side of the winger','Jog back at your own pace','Stay forward and call for the ball'],best:1,fb:'Sprint back immediately. A full back caught high when the team loses possession is one of the most dangerous situations in football. Get goal-side of the winger — your recovery speed is more valuable than anything else right now.'},
      {q:'Opposition winger receives facing away from you. Defensive approach?',opts:['Press immediately to stop them turning','Stay 1-2 yards off — jockey and force inside','Go in for the tackle straight away','Drop off and invite them to run at you'],best:1,fb:'Stay 1-2 yards off. Too tight and they turn you. Jockey them onto their weaker foot or force inside where your DM covers. Be patient — make them make the mistake.'},
      {q:'Your CB calls for cover — they are in a 1v1. Where do you position?',opts:['Come across to double up on the striker','Hold your width','Tuck diagonally behind the CB to cover the space','Sprint past them to intercept'],best:2,fb:'Tuck in diagonally behind. You create a two-man defensive block. If the striker beats the CB you are covering the space. Do not abandon your width unless the CB is about to be beaten.'},
      {q:'You have the ball in the opposition half. The winger is ahead. Center is congested. What do you do?',opts:['Overlap the winger for a 2v1','Play inside to the midfielder and hold your width','Cross it early from deep','Dribble into the box yourself'],best:0,fb:'Overlap. The 2v1 on the outside is your highest-value action as a full back. Your run forces a decision — if the winger goes inside you get the cross, if not you get the ball in space.'},
      {q:'Opposition corner. You are the furthest player forward. What do you do?',opts:['Drop back and defend','Stay forward as a counter outlet','Get to the edge of the box for a clearance','Sprint to the far post to defend'],best:1,fb:'Stay forward. Your team needs a quick counter outlet. If the clearance comes you are the option. If not — sprint back in time. Nine outfield players defending a corner is enough.'},
    ],
  },
  goalkeeper:{
    label:'Goalkeeper',emoji:'🧤',color:'#1D9E75',colorLight:'#E1F5EE',
    tagline:'Explosive Power · Reaction · Distribution',gymPriority:'Explosive Power + Mobility',
    gymStyle:{sets:'3–4',reps:'4–8',rest:'2 min',tempo:'Explosive/Ctrl'},
    sprintFocus:'Short explosive bursts 2-6m + lateral dive power',
    strengthFocus:'Upper body power + core — Press, Pull, Rotational stability',
    enduranceFocus:'Power and reaction training — not traditional cardio',
    agilityFocus:'Lateral shuffle, dive + recovery, reaction to visual cues',
    weeklyThemes:['Reaction Training','Diving Mechanics','Upper Body Power','DELOAD','Lateral Explosiveness','Shot-Stopping Focus','Full Integration','DELOAD','Distribution Power','Strength Peak','Reflex Training','DELOAD + Evaluate'],
    gameStats:['saves','goals_conceded','distribution_acc','claims','sweeper_actions'],
    gameStatLabels:{saves:'Saves',goals_conceded:'Goals Conceded',distribution_acc:'Distribution Accuracy %',claims:'Successful Claims',sweeper_actions:'Sweeper Actions'},
    kpis:['Save percentage','Goals conceded per game','Distribution accuracy','Claim success rate','Sweeper actions per game'],
    nutritionMultiplier:0.92,
    carbTiming:'Moderate carbs. High protein for upper body development and recovery.',
    sprintSessions:[
      {phase:'Explosive Bursts',reps:[{dist:'5m',sets:10,effort:'100%',rest:'60s'},{dist:'10m',sets:8,effort:'100%',rest:'90s'}]},
      {phase:'Lateral Power',reps:[{dist:'5m lateral',sets:8,effort:'100%',rest:'60s'}]},
      {phase:'Reaction Sprints',reps:[{dist:'10m on visual signal',sets:10,effort:'100%',rest:'45s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Power Clean (light-moderate)',sets:'4×4',tempo:'Explosive',focus:'Full-body explosive power for shot stopping'},
        {ex:'Barbell Bench Press',sets:'4×6–8',tempo:'2/1/2',focus:'Upper body power for distribution and 1v1'},
        {ex:'Overhead Press',sets:'4×6',tempo:'2/1/2',focus:'Arm strength for high ball claims'},
        {ex:'Lateral Med Ball Throws',sets:'4×6 each',tempo:'Explosive',focus:'Rotational power for distribution'},
        {ex:'Dead Bugs',sets:'3×10 each',tempo:'Slow',focus:'Core stability'},
        {ex:'Copenhagen Planks',sets:'3×20s each',tempo:'Ctrl',focus:'Groin injury prevention'},
        {ex:'Band External Rotations',sets:'3×15 each',tempo:'Ctrl',focus:'Shoulder health — critical for goalkeepers'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×6–10',tempo:'2/0/2',focus:'Back strength — command of the box'},
        {ex:'Barbell Rows',sets:'3×8',tempo:'2/1/2',focus:'Upper back stability'},
        {ex:'Single-Leg Squat progression',sets:'3×8 each',tempo:'Slow',focus:'Single-leg stability for diving recovery'},
        {ex:'Pallof Press',sets:'3×12 each',tempo:'Ctrl',focus:'Anti-rotation core for shot blocking'},
        {ex:'Side Planks',sets:'3×40s each',tempo:'Ctrl',focus:'Lateral stability for diving'},
        {ex:'Nordic Hamstring Curls',sets:'3×5',tempo:'Eccentric slow',focus:'Hamstring injury prevention'},
        {ex:'Hip 90/90 Mobility',sets:'2×60s each',tempo:'Ctrl',focus:'Hip mobility for extreme diving positions'},
      ],
      friday:[
        {ex:'Box Jumps (max height)',sets:'5×4',tempo:'Explosive',focus:'Vertical explosive power for high ball claims'},
        {ex:'Depth Jumps',sets:'4×4',tempo:'Reactive',focus:'Reactive dive speed'},
        {ex:'Lateral Bounds',sets:'4×6 each',tempo:'Explosive',focus:'Lateral dive explosiveness'},
        {ex:'Hip Mobility Circuit',sets:'3 rounds',tempo:'Ctrl',focus:'Mobility for extreme positions'},
        {ex:'Glute Bridges',sets:'3×12',tempo:'2/1/2',focus:'Posterior chain + lower back health'},
        {ex:'Single-Leg Calf Raises',sets:'3×15 each',tempo:'3/1/3',focus:'Lower leg strength'},
        {ex:'Farmer Carries',sets:'3×30m',tempo:'Ctrl',focus:'Grip + core stability'},
      ],
    },
    iq:[
      {q:'Striker is through 1v1. When do you come out?',opts:['Stay on your line until they shoot','Come out immediately the moment they receive','Come off your line to close the angle on their first touch','Wait until they are inside the box'],best:2,fb:'Come off your line on the first touch. This is the moment they have their head down controlling. Too early and they chip you. Too late and they have the whole goal.'},
      {q:'Your team is building under a high press. CB receives and is immediately closed. What do you do?',opts:['Stay on your line','Call loudly for the ball back','Move to give the CB an angle and call clearly','Stay quiet so you do not distract the defender'],best:2,fb:'Move and communicate. You are the safety valve. Get into a clear position at an angle — not straight behind — and call clearly. The CB needs to know the option is on before they receive.'},
      {q:'A cross comes in. Striker and your CB both attacking the ball. What do you do?',opts:['Come and claim it confidently','Stay and cover your near post','Punch it clear','Shout your CB name and leave it'],best:0,fb:'If you are coming — commit and claim. Call early and loud: "Keeper!" If you call — you own it. Win the ball with two hands at the highest point you can reach.'},
      {q:'Ball in your hands. Team pressing high. Best distribution?',opts:['Kick it long immediately','Throw to the nearest CB','Find the free CB or full back to maintain possession','Punt it long to the striker'],best:2,fb:'Find the free CB or full back. Your team pressing high means possession is valuable. A long ball under pressure gives it straight back — find the free player before you catch the ball.'},
      {q:'Opposition has a corner. Starting position and priority?',opts:['Stand in the middle of the goal','Stand on the back post','Position centrally 1-2 yards off the line — claim everything you can reach','Stand on the six-yard box line'],best:2,fb:'Off your line and central. Your job is to dominate the box. If you can reach it — claim it. Keepers who take ownership of their box concede far fewer set-piece goals.'},
    ],
  },
};

export function buildGymPlan(primaryPos, secondaryPos) {
  const primary = POSITIONS[primaryPos];
  const secondary = secondaryPos ? POSITIONS[secondaryPos] : null;
  if (!secondary) return primary?.gymPlan || {};
  const days = ['tuesday','thursday','friday'];
  const merged = {};
  days.forEach(day => {
    const pDay = primary.gymPlan?.[day] || [];
    const sDay = secondary.gymPlan?.[day] || [];
    const pNames = new Set(pDay.map(e => e.ex));
    const extras = sDay.filter(e => !pNames.has(e.ex)).slice(0,2);
    merged[day] = [...pDay, ...extras.map(e => ({...e,focus:`[${secondary.label}] ${e.focus}`}))];
  });
  return merged;
}

export const PERFORMANCE_FOCUS = {
  speed:   { label:'Speed',      calAdjust:+100, note:'Prioritize explosive training + sprint work. High carbs on speed days.' },
  strength:{ label:'Strength',   calAdjust:+200, note:'Heavier loads, longer rest. Extra protein for muscle adaptation.' },
  endurance:{ label:'Endurance', calAdjust:+150, note:'Aerobic base + repeat sprints. Consistent carb intake.' },
  power:   { label:'Power',      calAdjust:+150, note:'Explosive compound movements. Plyometrics as primary.' },
  maintain:{ label:'Maintain',   calAdjust:0,    note:'Consistent training at moderate intensity. Balanced nutrition.' },
  return:  { label:'Return From Injury', calAdjust:-100, note:'Conservative loading. Focus on movement quality over intensity.' },
};

export function calcNutrition(player) {
  const {weight_lbs=175,position,performance_focus,body_goal} = player;
  const pos = POSITIONS[position]||POSITIONS.striker;
  const focusKey = performance_focus||body_goal||'maintain';
  const focus = PERFORMANCE_FOCUS[focusKey]||PERFORMANCE_FOCUS.maintain;
  const baseCal = Math.round(weight_lbs*17*pos.nutritionMultiplier);
  const totalCal = baseCal+focus.calAdjust;
  const protein = Math.round(weight_lbs*1.0);
  const fat = Math.round(weight_lbs*0.45);
  const carbs = Math.round((totalCal-protein*4-fat*9)/4);
  return {calories:totalCal,protein,carbs,fat,note:focus.note,carbTiming:pos.carbTiming};
}

export function calcScore(player, latestCheckin, games) {
  let sprint=0,strength=0,consistency=0,soccer=0;
  if (latestCheckin?.sprint_40m) sprint=Math.min(100,Math.round(Math.max(0,(6.0-latestCheckin.sprint_40m)/1.6*100)));
  if (latestCheckin?.weight_lbs&&player.weight_lbs) strength=Math.min(100,Math.round(Math.min(latestCheckin.weight_lbs/player.weight_lbs,1)*50+sprint*0.5));
  if (latestCheckin?.days_trained||latestCheckin?.days_completed) consistency=Math.min(100,Math.round(((latestCheckin.days_trained||latestCheckin.days_completed||0)/7)*100));
  if (games&&games.length>=2) {
    const pos=player.position;
    if (pos==='striker'){const pa=games.reduce((s,g)=>s+(g.stats?.press_att||0),0);const pw=games.reduce((s,g)=>s+(g.stats?.press_won||0),0);const sh=games.reduce((s,g)=>s+(g.stats?.shots||0),0);const so=games.reduce((s,g)=>s+(g.stats?.shots_on_target||0),0);soccer=Math.round(((pa>0?pw/pa:0)*0.5+(sh>0?so/sh:0)*0.5)*100);}
    else if (pos.includes('midfielder')){const accs=games.filter(g=>g.stats?.pass_acc).map(g=>g.stats.pass_acc);soccer=accs.length?Math.round(accs.reduce((a,b)=>a+b,0)/accs.length):0;}
    else if (pos.includes('defender')){const t=games.reduce((s,g)=>s+(g.stats?.tackles||0),0);soccer=Math.min(100,Math.round((t/games.length)*10));}
    else if (pos==='goalkeeper'){const sv=games.reduce((s,g)=>s+(g.stats?.saves||0),0);const gc=games.reduce((s,g)=>s+(g.stats?.goals_conceded||0),0);soccer=Math.min(100,Math.round((sv/(sv+gc+1))*100));}
    else{const r=games.filter(g=>g.self_rating).map(g=>g.self_rating);soccer=r.length?Math.round((r.reduce((a,b)=>a+b,0)/r.length)*10):0;}
  }
  const hasSoccer=games&&games.length>=2;
  const total=hasSoccer?Math.round(sprint*.35+strength*.25+consistency*.25+soccer*.15):Math.round(sprint*.4+strength*.3+consistency*.3);
  return {total,sprint,strength,consistency,soccer,hasSoccer};
}
