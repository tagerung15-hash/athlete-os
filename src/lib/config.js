// src/lib/config.js — v2

export const POSITIONS = {
  striker: {
    label:'Striker',emoji:'⚽',color:'#E24B4A',colorLight:'#FCEBEB',
    tagline:'Speed · Finishing · Pressing',gymPriority:'Power + Size',
    gymStyle:{sets:'4',reps:'6–10',rest:'90s–2min',tempo:'2/1/2'},
    sprintFocus:'Acceleration + Repeat Sprint Ability',
    strengthFocus:'Explosive Power — Squats, RDLs, Single-Leg',
    enduranceFocus:'High-intensity intervals, press-reset-press',
    agilityFocus:'L-drill, reaction sprints, deceleration',
    weeklyThemes:['Acceleration','Finishing','Strength PRs','DELOAD','Max Velocity','Agility','Soccer Integration','DELOAD','Game Speed','Size Peak','Sprint PR','DELOAD + Evaluate'],
    gameStats:['goals','shots','shots_on_target','press_att','press_won'],
    gameStatLabels:{goals:'Goals',shots:'Shots',shots_on_target:'Shots on Target',press_att:'Presses Attempted',press_won:'Presses Won'},
    kpis:['Goals/game','Shot accuracy %','Press win %','Sprint recovery time'],
    nutritionMultiplier:1.0,
    carbTiming:'High carbs pre-match and post-sprint. Moderate on gym days.',
    sprintSessions:[
      {phase:'Pure Speed',reps:[{dist:'30m',sets:4,effort:'95-100%',rest:'2.5 min'},{dist:'60m',sets:4,effort:'90-95%',rest:'3 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'150m',sets:3,effort:'85-90%',rest:'90s'},{dist:'100m',sets:4,effort:'88-92%',rest:'75s'}]},
      {phase:'Game Sim',reps:[{dist:'40m dead legs',sets:6,effort:'Max',rest:'25-30s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'4×6–8',tempo:'3/1/2',focus:'Primary power lift — sprint force production'},
        {ex:'Romanian Deadlift',sets:'3×8–10',tempo:'3/0/1',focus:'Hamstrings + glutes — acceleration'},
        {ex:'Barbell Bench Press',sets:'4×6–8',tempo:'2/1/2',focus:'Upper body mass'},
        {ex:'Overhead Press',sets:'3×6–8',tempo:'2/1/2',focus:'Shoulder size + strength'},
        {ex:'Lateral Raises',sets:'4×12–15',tempo:'2/0/2',focus:'Frame width'},
        {ex:'Cable Curls',sets:'3×12',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups (weighted)',sets:'4×6–10',tempo:'2/0/3',focus:'Back width + thickness'},
        {ex:'Barbell Rows',sets:'4×8–10',tempo:'2/1/2',focus:'Mid-back density'},
        {ex:'Bulgarian Split Squat',sets:'3×10 each',tempo:'2/1/2',focus:'Single-leg power for change of direction'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Barbell Curl',sets:'4×8–10',tempo:'2/0/2',focus:'Primary arm lift — log this'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'Brachialis thickness'},
        {ex:'Overhead Tricep Ext.',sets:'3×12',tempo:'2/1/2',focus:'Long head — ARM FINISHER'},
      ],
      friday:[
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Reactive power — first step'},
        {ex:'Leg Press',sets:'3×10–12',tempo:'2/1/2',focus:'Quad volume'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring isolation'},
        {ex:'Calf Raises (slow)',sets:'4×15–20',tempo:'3/1/3',focus:'Achilles strength'},
        {ex:'Skull Crushers',sets:'3×10–12',tempo:'2/0/2',focus:'Primary tricep lift — log this'},
        {ex:'Close-Grip Bench',sets:'3×8–10',tempo:'2/1/2',focus:'Tricep mass'},
        {ex:'Bicep 21s',sets:'3 sets',tempo:'Ctrl',focus:'Full bicep pump'},
      ],
    },
    iq:[
      {q:'GK receives a back-pass under pressure. What is your press approach?',opts:['Sprint straight at the GK','Approach curved to cut off near throw and force the long ball','Stand and wait to intercept','Press the CB who passed back'],best:1,fb:'Curved approach cuts the short option. Force the long ball your team is already set for. Straight sprint gives too many angles.'},
      {q:'You pressed and lost the ball. CB now has it with back to goal. Next 5 seconds?',opts:['Jog back and reset shape','Sprint back to defensive line','Counter-press immediately — they are disorganized for exactly 5 seconds','Call for the ball from a midfielder'],best:2,fb:'5-second window after losing possession is your best chance to win it back. After that get back in shape.'},
      {q:'80th minute, heavy legs, 1v1 inside the box. What is your first touch?',opts:['Dribble past with raw speed','Shield and hold up','First touch away from defender then strike','Pass — too tired to finish'],best:2,fb:'Heavy legs means simplify. One touch to create space, commit to the shot. You trained this exhausted.'},
      {q:'CB has ball wide, about to play out. Where do you press?',opts:['Straight at the ball','Cut off GK pass and show the outside','Stand between CB and midfielder','Wait to intercept'],best:1,fb:'Force them outside away from center. Forcing a worse option is a successful press even without winning the ball.'},
      {q:'You are in behind the defense, keeper coming out. What do you do?',opts:['Go around the keeper','Chip the keeper','Strike low to the far post','Slow down and wait'],best:2,fb:'Far post low is the highest percentage finish 1v1 with a keeper. Most target area, most distance for the keeper to cover.'},
    ],
  },
  winger:{
    label:'Winger',emoji:'⚡',color:'#BA7517',colorLight:'#FAEEDA',
    tagline:'Max Velocity · Agility · 1v1',gymPriority:'Speed + Elasticity',
    gymStyle:{sets:'3–4',reps:'5–8',rest:'2–3 min',tempo:'Explosive'},
    sprintFocus:'Top-end speed + 1v1 acceleration',
    strengthFocus:'Unilateral power — Split squats, single-leg RDL',
    enduranceFocus:'Repeated high-speed runs with full recovery',
    agilityFocus:'T-drill, box agility, direction change under pressure',
    weeklyThemes:['Top-End Speed','Dribbling + Agility','Strength Power','DELOAD','Max Velocity','1v1 Scenarios','Cross + Finish','DELOAD','Game Speed','Sprint PRs','Explosive Peak','DELOAD + Evaluate'],
    gameStats:['chances_created','crosses','dribbles_won','press_att','goals'],
    gameStatLabels:{chances_created:'Chances Created',crosses:'Crosses',dribbles_won:'Dribbles Won',press_att:'Presses',goals:'Goals'},
    kpis:['Dribble success %','Chances created/game','Crosses completed','Max sprint speed'],
    nutritionMultiplier:1.0,
    carbTiming:'Very high carbs on track/sprint days. Moderate on gym days.',
    sprintSessions:[
      {phase:'Pure Speed',reps:[{dist:'20m',sets:6,effort:'100%',rest:'2 min'},{dist:'40m',sets:4,effort:'95%',rest:'2.5 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'80m',sets:5,effort:'90%',rest:'75s'},{dist:'120m',sets:3,effort:'87%',rest:'90s'}]},
      {phase:'Game Sim',reps:[{dist:'30m',sets:8,effort:'Max',rest:'20s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Power Clean (light)',sets:'4×4',tempo:'Explosive',focus:'Full-body elastic power'},
        {ex:'Bulgarian Split Squat',sets:'4×8 each',tempo:'2/1/2',focus:'Unilateral leg power for cuts'},
        {ex:'Single-Leg RDL',sets:'3×10 each',tempo:'3/0/1',focus:'Hamstring stability'},
        {ex:'Incline DB Press',sets:'3×8–10',tempo:'2/1/2',focus:'Upper body without bulk'},
        {ex:'Lateral Raises',sets:'4×15',tempo:'2/0/2',focus:'Shoulder frame'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×8–12',tempo:'2/0/2',focus:'Back width — relative strength'},
        {ex:'Single-Leg Box Jump',sets:'4×5 each',tempo:'Explosive',focus:'Unilateral reactive power'},
        {ex:'Barbell Rows',sets:'3×10',tempo:'2/1/2',focus:'Back thickness'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
        {ex:'Tricep Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Broad Jumps',sets:'4×5',tempo:'Explosive',focus:'Horizontal power — stride length'},
        {ex:'Depth Jumps (Wk8+)',sets:'3×4',tempo:'Reactive',focus:'Elastic strength — first step'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring isolation'},
        {ex:'Calf Raises',sets:'4×15',tempo:'3/1/3',focus:'Achilles + lower leg elasticity'},
        {ex:'Skull Crushers',sets:'3×10',tempo:'2/0/2',focus:'Primary tricep — log this'},
        {ex:'Bicep 21s',sets:'3 sets',tempo:'Ctrl',focus:'Full bicep pump'},
      ],
    },
    iq:[
      {q:'Defender is closing with body open to the outside. What do you do?',opts:['Go outside into the space they show','Fake outside then cut inside onto your strong foot','Hold and play square','Sprint straight at them'],best:1,fb:'Fake the outside, cut inside onto your stronger foot. When a defender shows you the outside they expect you to take it.'},
      {q:'You receive the ball wide with a defender closing fast. Space is in behind. What do you do?',opts:['Cut inside immediately','One touch to set then drive in behind at full speed','Hold and wait for support','Play it back safe'],best:1,fb:'One touch to set direction then drive in behind. The first step with purpose beats any defender. Hesitation is the only thing that kills this.'},
      {q:'You are at full pace 1v1 with the last defender. Highest percentage decision?',opts:['Go around them at speed','Cut back and slow down','Shoot immediately','Look for a cutback option'],best:0,fb:'At full pace with the last defender — commit and go around. You have the pace advantage. Any slowdown lets them recover.'},
      {q:'Cross is blocked, ball comes straight back to you. What do you do?',opts:['Cross again immediately','Play back to maintain possession','Take a touch and drive inside','Shoot'],best:0,fb:'Cross again immediately. Defenders are still scrambling from the first cross. Second delivery before they reset is the most dangerous ball you can put in.'},
      {q:'Your team is pressing high and wins the ball centrally. You are wide. What run?',opts:['Stay wide and call for it','Make a diagonal run inside to create a 3v2','Drop deep to help build out','Stand still and wait'],best:0,fb:'Stay wide initially to stretch the opposition. Your width first — then the diagonal run in behind once the ball moves forward.'},
    ],
  },
  midfielder_cm:{
    label:'Central Midfielder',emoji:'🔄',color:'#185FA5',colorLight:'#E6F1FB',
    tagline:'Endurance · Work Rate · Box-to-Box',gymPriority:'Endurance + Balance',
    gymStyle:{sets:'3',reps:'10–15',rest:'60–90s',tempo:'2/1/2'},
    sprintFocus:'Repeated sprints with short recovery',
    strengthFocus:'Balanced — Squat, Bench, Pull-ups, Core',
    enduranceFocus:'Zone 2 aerobic base + anaerobic intervals',
    agilityFocus:'5-10-5 shuttle, reaction, quick direction changes',
    weeklyThemes:['Aerobic Base','Box-to-Box Endurance','Strength Balance','DELOAD','Tempo Intervals','Agility + Reaction','Full Integration','DELOAD','Game Fitness','Strength PRs','Sprint Endurance','DELOAD + Evaluate'],
    gameStats:['passes','pass_acc','chances_created','distance_km','press_att'],
    gameStatLabels:{passes:'Passes',pass_acc:'Pass Accuracy %',chances_created:'Chances Created',distance_km:'Distance (km)',press_att:'Presses'},
    kpis:['Distance covered/game','Pass accuracy %','Chances created','Sprints per game'],
    nutritionMultiplier:1.05,
    carbTiming:'High carbs on all training days. Intra-session carbs on long sessions.',
    sprintSessions:[
      {phase:'Tempo Endurance',reps:[{dist:'200m',sets:6,effort:'80%',rest:'60s'},{dist:'400m',sets:3,effort:'75%',rest:'2 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'90%',rest:'30s'},{dist:'60m',sets:5,effort:'87%',rest:'45s'}]},
      {phase:'Game Sim',reps:[{dist:'40m',sets:10,effort:'85%',rest:'20s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'3×10–12',tempo:'2/1/2',focus:'Leg endurance base'},
        {ex:'Barbell Bench Press',sets:'3×10',tempo:'2/1/2',focus:'Balanced upper body'},
        {ex:'Romanian Deadlift',sets:'3×12',tempo:'3/0/1',focus:'Posterior chain endurance'},
        {ex:'Overhead Press',sets:'3×10',tempo:'2/1/2',focus:'Shoulder balance'},
        {ex:'Core Circuit: Planks + Dead Bugs + Ab Wheel',sets:'3 rounds',tempo:'Ctrl',focus:'Core endurance for 90 min'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'3×10–12',tempo:'2/0/2',focus:'Back strength'},
        {ex:'Barbell Rows',sets:'3×12',tempo:'2/1/2',focus:'Mid-back'},
        {ex:'Bulgarian Split Squat',sets:'3×12 each',tempo:'2/1/2',focus:'Single-leg balance'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Barbell Curl',sets:'3×12',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Leg Press',sets:'3×15',tempo:'2/1/2',focus:'Quad endurance'},
        {ex:'Leg Curl',sets:'3×15',tempo:'2/1/2',focus:'Hamstring endurance'},
        {ex:'Calf Raises',sets:'3×20',tempo:'2/1/2',focus:'Lower leg endurance'},
        {ex:'Farmer Carries',sets:'4×30m',tempo:'Ctrl',focus:'Grip + core + work capacity'},
        {ex:'Skull Crushers',sets:'3×12',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Bicep 21s',sets:'2 sets',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
    },
    iq:[
      {q:'You receive between the lines with a defender tight behind. What do you do?',opts:['Turn immediately','Check shoulder then play a one-two to release into space','Hold and shield','Play it back'],best:1,fb:'Check your shoulder before you receive. You should already know what is behind you. The one-two releases you. Turning with someone tight loses the ball.'},
      {q:'Your team is slowing down in possession in the opposition half. What do you do?',opts:['Stay in position','Make a run to create a passing lane and force defenders to decide','Ask for ball to feet','Drop deep to get involved'],best:1,fb:'Movement creates decisions. A run between the lines forces the defense to react. Your movement is as valuable as your touch.'},
      {q:'Opposition breaks through your half. You are deepest midfielder. Priority?',opts:['Chase the ball carrier','Drop in front of center backs to cut the passing lane','Sprint to press the ball','Track an oncoming midfielder'],best:1,fb:'Drop and cut the lane. You cannot outrun the counter but you can reduce options. Getting between ball and goal makes the next pass harder.'},
      {q:'Ball at your feet in the final third. Striker making a run in behind. What do you do?',opts:['Play it safe back','Play wide to winger','Release the through ball into the run','Carry it yourself'],best:2,fb:'The through ball into the run is the highest percentage chance creation from this position. You see it — play it. Hesitation kills it.'},
      {q:'Winning 1-0. Last 10 minutes. Your priority?',opts:['Press high to win it back','Control tempo — receive, face away from pressure, use the clock','Make aggressive forward runs','Play quick forward passes'],best:1,fb:'Control tempo. Receive, face away from pressure, make them run to you. Every second on the ball is a second off the clock.'},
    ],
  },
  midfielder_dm:{
    label:'Defensive Midfielder',emoji:'🛡',color:'#185FA5',colorLight:'#E6F1FB',
    tagline:'Physicality · Duels · Covering',gymPriority:'Endurance + Balance',
    gymStyle:{sets:'4',reps:'6–10',rest:'90s',tempo:'3/1/2'},
    sprintFocus:'Short explosive bursts + covering sprints (5-15m)',
    strengthFocus:'Strength-dominant — Squat, Deadlift, Physical presence',
    enduranceFocus:'High-intensity repeats with aerobic base',
    agilityFocus:'5-10-5 shuttle, tackle positioning, reaction',
    weeklyThemes:['Physical Base','Duel Strength','Explosive Endurance','DELOAD','Strength Peak','Aerobic Top-Up','Full Integration','DELOAD','Game Fitness','Strength PRs','Explosive Peak','DELOAD + Evaluate'],
    gameStats:['passes','tackles','interceptions','distance_km','duels_won'],
    gameStatLabels:{passes:'Passes',tackles:'Tackles',interceptions:'Interceptions',distance_km:'Distance (km)',duels_won:'Duels Won'},
    kpis:['Tackles/game','Interceptions/game','Duel win %','Distance covered'],
    nutritionMultiplier:1.05,
    carbTiming:'Moderate-high carbs. Extra protein for physical recovery.',
    sprintSessions:[
      {phase:'Explosive Bursts',reps:[{dist:'10m',sets:10,effort:'100%',rest:'60s'},{dist:'20m',sets:8,effort:'97%',rest:'90s'}]},
      {phase:'Repeat Speed',reps:[{dist:'30m',sets:6,effort:'90%',rest:'40s'},{dist:'60m',sets:4,effort:'87%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'300m',sets:4,effort:'75%',rest:'90s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Deadlift',sets:'4×5–6',tempo:'3/1/1',focus:'Primary strength — physical dominance'},
        {ex:'Barbell Back Squat',sets:'4×8',tempo:'3/1/2',focus:'Lower body strength'},
        {ex:'Barbell Bench Press',sets:'4×8',tempo:'2/1/2',focus:'Upper body power for duels'},
        {ex:'Overhead Press',sets:'3×8',tempo:'2/1/2',focus:'Shoulder strength'},
        {ex:'Heavy Carries + Planks',sets:'3 rounds',tempo:'Ctrl',focus:'Physical presence + stability'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups (weighted)',sets:'4×6–8',tempo:'2/0/3',focus:'Upper body strength'},
        {ex:'Barbell Rows',sets:'4×8',tempo:'2/1/2',focus:'Back power'},
        {ex:'Romanian Deadlift',sets:'3×10',tempo:'3/0/1',focus:'Hamstrings + glutes'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Barbell Curl',sets:'4×8',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Explosive covers and bursts'},
        {ex:'Bulgarian Split Squat',sets:'3×10 each',tempo:'2/1/2',focus:'Single-leg strength'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring health'},
        {ex:'Calf Raises',sets:'4×15',tempo:'3/1/3',focus:'Lower leg'},
        {ex:'Skull Crushers',sets:'3×10',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Bicep 21s',sets:'3 sets',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
    },
    iq:[
      {q:'Opposition striker drops deep between the lines. Do you follow or hold?',opts:['Follow the striker out immediately','Hold your position and let CB deal with it','Step to cut the pass','Drop into the defensive line'],best:0,fb:'Follow. Your job is to neutralize the 10 or false 9. If you hold they receive with time. Step to cut the pass or follow tight — communicate with the CB behind you.'},
      {q:'You have the ball in your own half with time. Priority?',opts:['Drive forward','Play it quickly forward','Scan first — find the free player before receiving','Play it back to the keeper'],best:2,fb:'Scan before you receive. By the time the ball arrives you should know where the free player is. The DM is the pivot — move the ball quickly to the right place.'},
      {q:'Opposition wins ball and immediately plays forward. You are between ball and defense. What do you do?',opts:['Back off into the line','Press immediately','Position to cut forward pass and force wide','Sprint to intercept'],best:2,fb:'Cut the forward pass and force wide. You cannot win it immediately without getting beaten. Slow the attack, make them go wide where your team can recover shape.'},
      {q:'You win a duel in the midfield park. Ball falls loose. What do you do?',opts:['Play first safe pass','Shield and wait for support','Look up immediately and play forward if on','Clear it long'],best:2,fb:'Win the duel, look up immediately. Opposition is disorganized for 2-3 seconds. A forward pass in this moment turns defense into attack.'},
      {q:'Opposition is playing through you consistently with combinations. What do you adjust?',opts:['Press harder individually','Sit deeper in a midblock shape','Go man-to-man','Keep current shape'],best:1,fb:'Drop into a midblock. If they are playing through you it means you are too high and too spread. Compact space, shorten passing lanes, force them wide or long.'},
    ],
  },
  defender_cb:{
    label:'Centre Back',emoji:'🧱',color:'#5B3FA8',colorLight:'#EEEDFE',
    tagline:'Strength · Aerial · Organizing',gymPriority:'Strength + Power',
    gymStyle:{sets:'4–5',reps:'4–8',rest:'2–3 min',tempo:'3/1/2'},
    sprintFocus:'Explosive 5-20m bursts + recovery sprints',
    strengthFocus:'Maximum strength — Deadlift, Squat, Upper body power',
    enduranceFocus:'Moderate aerobic base, high-intensity short intervals',
    agilityFocus:'Backpedal + plant, T-drill, aerial positioning',
    weeklyThemes:['Strength Foundation','Aerial Dominance','Short-Burst Speed','DELOAD','Max Strength','Defensive Agility','Full Integration','DELOAD','Game Fitness','Strength Peak','Explosive Power','DELOAD + Evaluate'],
    gameStats:['tackles','interceptions','clearances','aerial_won','pass_acc'],
    gameStatLabels:{tackles:'Tackles',interceptions:'Interceptions',clearances:'Clearances',aerial_won:'Aerials Won',pass_acc:'Pass Accuracy %'},
    kpis:['Aerial duel %','Tackles/game','Clearances/game','Pass accuracy %'],
    nutritionMultiplier:1.02,
    carbTiming:'Moderate carbs. Protein-forward on heavy gym days.',
    sprintSessions:[
      {phase:'Explosive Power',reps:[{dist:'10m',sets:8,effort:'100%',rest:'90s'},{dist:'20m',sets:6,effort:'97%',rest:'2 min'}]},
      {phase:'Recovery Sprints',reps:[{dist:'30m',sets:5,effort:'90%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'200m',sets:4,effort:'75%',rest:'90s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Deadlift',sets:'5×4–5',tempo:'3/1/1',focus:'Maximum strength — physical dominance'},
        {ex:'Barbell Back Squat',sets:'4×6',tempo:'3/1/2',focus:'Lower body max strength'},
        {ex:'Barbell Bench Press',sets:'4×6–8',tempo:'2/1/2',focus:'Upper body power for aerials'},
        {ex:'Overhead Press',sets:'4×6',tempo:'2/1/2',focus:'Shoulder strength'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups (weighted)',sets:'5×5–8',tempo:'2/0/3',focus:'Back strength for aerial contests'},
        {ex:'Barbell Rows',sets:'4×6–8',tempo:'2/1/2',focus:'Upper back power'},
        {ex:'Romanian Deadlift',sets:'3×8',tempo:'3/0/1',focus:'Posterior chain'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Barbell Curl',sets:'4×8',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Box Jumps (max height)',sets:'5×4',tempo:'Explosive',focus:'Vertical explosive power for high balls'},
        {ex:'Bulgarian Split Squat',sets:'4×8 each',tempo:'2/1/2',focus:'Single-leg strength'},
        {ex:'Leg Curl',sets:'3×10',tempo:'2/1/2',focus:'Hamstring health'},
        {ex:'Calf Raises',sets:'4×15',tempo:'3/1/3',focus:'Lower leg strength'},
        {ex:'Skull Crushers',sets:'4×8',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Close-Grip Bench',sets:'3×10',tempo:'2/1/2',focus:'ARM FINISHER'},
      ],
    },
    iq:[
      {q:'Striker drops deep to receive. Do you follow or hold your line?',opts:['Follow the striker all the way out','Hold your line and let the DM deal with it','Step and press the striker on the turn','Drop deeper'],best:1,fb:'Hold your line. DM handles the press. Your job is to hold shape and cover space in behind. If you follow out you open the channel for a run behind you.'},
      {q:'Striker is in behind you and the keeper is coming out. What do you do?',opts:['Sprint to catch up','Slow your run to delay and wait for help','Give up','Tackle from behind'],best:1,fb:'Delay. You cannot catch a striker in behind but you can slow them down. Get goal-side, delay until your keeper is set or a teammate recovers.'},
      {q:'Keeper plays it to you under pressure. Striker closing fast. What do you do?',opts:['Clear it long immediately','Play back to keeper','Scan and find the free player before the press arrives','Carry it under pressure'],best:2,fb:'Scan before you receive. You should know where the free player is before the ball arrives. If not comfortable — play back to the keeper. Never clear blindly under control.'},
      {q:'You are defending a corner. What is your job?',opts:['Man mark tightly','Hold your zone and attack the ball','Follow your player everywhere','Stand on the goal line'],best:1,fb:'Attack the ball. Whether zonal or man-marking — your job is to win your header. Get to the ball first. Passive defending at set pieces is how goals are conceded.'},
      {q:'Ball over the top. You and the striker are racing for it. What do you do?',opts:['Win the foot race at all costs','Get goal-side and let keeper come','Head it clear regardless','Wait and see'],best:1,fb:'Get goal-side and communicate with your keeper. Do not gamble — if you miss the header you have played the striker clean through. Goal-side forces them wide or through the keeper.'},
    ],
  },
  defender_fb:{
    label:'Full Back',emoji:'🔀',color:'#5B3FA8',colorLight:'#EEEDFE',
    tagline:'Endurance · Speed · Overlaps',gymPriority:'Strength + Power',
    gymStyle:{sets:'3–4',reps:'8–12',rest:'90s',tempo:'2/1/2'},
    sprintFocus:'Repeated high-speed runs down the flank',
    strengthFocus:'Balanced power — Squat, Unilateral, Upper body',
    enduranceFocus:'High total distance + sprint recovery ability',
    agilityFocus:'Direction change, overlap timing, defensive transitions',
    weeklyThemes:['Aerobic Base','Overlap Speed','Strength Balance','DELOAD','Repeat Speed','Defensive Agility','Full Integration','DELOAD','Game Fitness','Sprint PRs','Endurance Peak','DELOAD + Evaluate'],
    gameStats:['tackles','crosses','chances_created','distance_km','dribbles_won'],
    gameStatLabels:{tackles:'Tackles',crosses:'Crosses',chances_created:'Chances Created',distance_km:'Distance (km)',dribbles_won:'Dribbles Won'},
    kpis:['Distance covered/game','Crosses completed','Tackles/game','Sprint recovery time'],
    nutritionMultiplier:1.05,
    carbTiming:'High carbs on sprint/track days. Moderate on gym days.',
    sprintSessions:[
      {phase:'Flank Speed',reps:[{dist:'40m',sets:5,effort:'95%',rest:'2 min'},{dist:'60m',sets:3,effort:'90%',rest:'2.5 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'88%',rest:'35s'},{dist:'50m',sets:5,effort:'85%',rest:'45s'}]},
      {phase:'Game Sim',reps:[{dist:'40m',sets:8,effort:'Max',rest:'25s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Barbell Back Squat',sets:'4×8',tempo:'3/1/2',focus:'Leg power for overlap runs'},
        {ex:'Romanian Deadlift',sets:'3×10',tempo:'3/0/1',focus:'Hamstrings for repeated sprints'},
        {ex:'Barbell Bench Press',sets:'3×10',tempo:'2/1/2',focus:'Upper body balance'},
        {ex:'Lateral Raises',sets:'3×15',tempo:'2/0/2',focus:'Shoulder frame'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×8–10',tempo:'2/0/2',focus:'Back strength'},
        {ex:'Barbell Rows',sets:'3×10',tempo:'2/1/2',focus:'Mid-back'},
        {ex:'Bulgarian Split Squat',sets:'3×10 each',tempo:'2/1/2',focus:'Single-leg power + stability'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health'},
        {ex:'Barbell Curl',sets:'3×10',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Box Jumps',sets:'4×5',tempo:'Explosive',focus:'Explosive first step on overlaps'},
        {ex:'Leg Press',sets:'3×12',tempo:'2/1/2',focus:'Quad endurance'},
        {ex:'Leg Curl',sets:'3×12',tempo:'2/1/2',focus:'Hamstring endurance'},
        {ex:'Calf Raises',sets:'4×20',tempo:'2/1/2',focus:'Lower leg endurance — critical for FBs'},
        {ex:'Skull Crushers',sets:'3×10',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Bicep 21s',sets:'2 sets',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
    },
    iq:[
      {q:'You push forward and your team loses the ball. What do you do?',opts:['Keep pushing — you might get it back','Sprint back immediately to get goal-side of the winger','Jog back at your own pace','Stay forward and call for it'],best:1,fb:'Sprint back immediately. A full back caught high when the team loses possession is one of the most dangerous moments in football. Get goal-side of the winger.'},
      {q:'Opposition winger receives facing away from you. Defensive approach?',opts:['Press immediately','Stay 1-2 yards off and jockey, force inside','Go in for the tackle straight away','Drop off and invite them forward'],best:1,fb:'Stay 1-2 yards off. Too tight and they turn you. Jockey onto their weaker foot or force inside where your DM covers. Be patient.'},
      {q:'Your CB is in a 1v1 and calls for cover. Where do you position?',opts:['Double up on the striker','Hold your width','Tuck diagonally behind the CB to cover the space','Sprint past them to intercept'],best:2,fb:'Tuck in diagonally behind. You create a two-man defensive block. If the striker beats the CB you are covering the space.'},
      {q:'You have the ball in the opposition half with the winger ahead of you. Center is congested. What do you do?',opts:['Overlap the winger for a 2v1','Play inside to the midfielder and hold your width','Cross it early from deep','Dribble into the box yourself'],best:0,fb:'Overlap. The 2v1 on the outside is your highest value action as a full back. Your run forces a decision. If the winger goes inside you get the cross. If not you get the ball in space.'},
      {q:'Set piece. Corner against your team. You are the furthest player up the pitch. What do you do?',opts:['Drop back and defend','Stay forward for a counter','Get to edge of box for the clearance','Sprint to the far post'],best:1,fb:'Stay forward. Your team needs an outlet. If the clearance comes you are the quick counter option. If not — sprint back in time. Nine outfield players defending the corner is enough.'},
    ],
  },
  goalkeeper:{
    label:'Goalkeeper',emoji:'🧤',color:'#1D9E75',colorLight:'#E1F5EE',
    tagline:'Power · Reaction · Distribution',gymPriority:'Explosive + Mobility',
    gymStyle:{sets:'3–4',reps:'4–8',rest:'2 min',tempo:'Explosive/Ctrl'},
    sprintFocus:'Short explosive bursts (2-6m) + diving power',
    strengthFocus:'Upper body power + core — Press, Pull, Rotational',
    enduranceFocus:'Power and reaction training — not cardio-focused',
    agilityFocus:'Lateral shuffle, dive + recovery, reaction drills',
    weeklyThemes:['Reaction Training','Diving Mechanics','Upper Body Power','DELOAD','Lateral Explosiveness','Shot-Stopping IQ','Full Integration','DELOAD','Distribution Power','Strength Peak','Reflex Training','DELOAD + Evaluate'],
    gameStats:['saves','goals_conceded','distribution_acc','claims','sweeper_actions'],
    gameStatLabels:{saves:'Saves',goals_conceded:'Goals Conceded',distribution_acc:'Distribution Acc %',claims:'Claims',sweeper_actions:'Sweeper Actions'},
    kpis:['Save percentage','Goals conceded/game','Distribution accuracy','Claim success %'],
    nutritionMultiplier:0.92,
    carbTiming:'Moderate carbs. High protein for upper body development.',
    sprintSessions:[
      {phase:'Explosive Bursts',reps:[{dist:'5m',sets:10,effort:'100%',rest:'60s'},{dist:'10m',sets:8,effort:'100%',rest:'90s'}]},
      {phase:'Lateral Power',reps:[{dist:'5m lateral',sets:8,effort:'100%',rest:'60s'}]},
      {phase:'Reaction Sprints',reps:[{dist:'10m on signal',sets:10,effort:'100%',rest:'45s'}]},
    ],
    gymPlan:{
      tuesday:[
        {ex:'Power Clean (light-moderate)',sets:'4×4',tempo:'Explosive',focus:'Full-body explosive power'},
        {ex:'Barbell Bench Press',sets:'4×6–8',tempo:'2/1/2',focus:'Upper body power for 1v1 and distribution'},
        {ex:'Overhead Press',sets:'4×6',tempo:'2/1/2',focus:'Arm strength overhead'},
        {ex:'Lateral Med Ball Throws',sets:'4×6 each',tempo:'Explosive',focus:'Rotational power for distribution'},
        {ex:'Cable Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
        {ex:'Rope Pushdowns',sets:'3×15',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      thursday:[
        {ex:'Pull-Ups',sets:'4×6–10',tempo:'2/0/2',focus:'Back strength — command of box'},
        {ex:'Barbell Rows',sets:'3×8',tempo:'2/1/2',focus:'Upper back'},
        {ex:'Single-Leg Squat progression',sets:'3×8 each',tempo:'Slow',focus:'Single-leg stability for diving recovery'},
        {ex:'Face Pulls',sets:'3×15',tempo:'Ctrl',focus:'Shoulder health — critical for GKs'},
        {ex:'Barbell Curl',sets:'3×10',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Hammer Curls',sets:'3×12',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
      friday:[
        {ex:'Box Jumps (max height)',sets:'5×4',tempo:'Explosive',focus:'Vertical explosive power for high balls'},
        {ex:'Depth Jumps',sets:'4×4',tempo:'Reactive',focus:'Reactive dive speed'},
        {ex:'Lateral Bounds',sets:'4×6 each',tempo:'Explosive',focus:'Lateral dive explosiveness'},
        {ex:'Hip Mobility Circuit',sets:'3 rounds',tempo:'Ctrl',focus:'Mobility for extreme positions'},
        {ex:'Skull Crushers',sets:'3×10',tempo:'2/0/2',focus:'ARM FINISHER'},
        {ex:'Bicep 21s',sets:'2 sets',tempo:'Ctrl',focus:'ARM FINISHER'},
      ],
    },
    iq:[
      {q:'Striker is through 1v1. When do you come out?',opts:['Stay on your line until they shoot','Come out immediately the moment they receive','Come off your line to close the angle on the first touch','Wait until they are in the box'],best:2,fb:'Come off your line on the first touch. This is the moment they have their head down controlling. Too early and they chip you. Too late and they have the whole goal.'},
      {q:'Your team is building from the back under a high press. CB receives and is immediately closed. What do you do?',opts:['Stay on your line','Call loudly for the ball back','Move to give the CB an angle and call clearly','Stay quiet so you do not distract'],best:2,fb:'Move and communicate. You are the safety valve. Get into a clear position at an angle — not straight behind them — and call clearly. The CB needs to know the option is on.'},
      {q:'Cross comes in. Striker and your CB both attacking the ball. What do you do?',opts:['Come and claim it confidently','Stay and cover your near post','Punch it clear','Shout your CB\'s name and leave it'],best:0,fb:'If you are coming — commit and claim. Call early and loud: "Keeper!" If you call — you own it. Win the ball with two hands at the highest point you can reach.'},
      {q:'You have the ball in your hands. Your team is pressing high. Best distribution?',opts:['Kick it long immediately','Throw to nearest CB','Look to play short to the free CB or full back','Punt it to the striker'],best:2,fb:'Find the free CB or full back. Your team pressing high means possession is valuable. A long ball under pressure gives it straight back.'},
      {q:'Opposition has a corner. Your starting position and priority?',opts:['Stand in the middle of the goal','Stand on the back post','Position centrally 1-2 yards off the line and claim everything you can reach','Stand on the six-yard box line'],best:2,fb:'Off your line and central. Your job is to dominate the box. If you can reach it — claim it. Keepers who take ownership of their box concede far fewer set piece goals.'},
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
    merged[day] = [...pDay, ...extras.map(e => ({...e, focus:`[${secondary.label}] ${e.focus}`}))];
  });
  return merged;
}

export const BODY_GOALS = {
  gain:{label:'Gain Muscle',calAdjust:+300,note:'Lean bulk — ~0.5 lb/week target gain'},
  maintain:{label:'Maintain',calAdjust:0,note:'Body recomposition — strength up, fat neutral'},
  cut:{label:'Cut / Lean Out',calAdjust:-300,note:'Preserve muscle while losing fat — high protein critical'},
};

export function calcNutrition(player) {
  const {weight_lbs=175,position,body_goal} = player;
  const pos = POSITIONS[position]||POSITIONS.striker;
  const goal = BODY_GOALS[body_goal]||BODY_GOALS.maintain;
  const baseCal = Math.round(weight_lbs*17*pos.nutritionMultiplier);
  const totalCal = baseCal+goal.calAdjust;
  const protein = Math.round(weight_lbs*1.0);
  const fat = Math.round(weight_lbs*0.45);
  const carbs = Math.round((totalCal-protein*4-fat*9)/4);
  return {calories:totalCal,protein,carbs,fat,note:goal.note,carbTiming:pos.carbTiming};
}

export function calcScore(player, latestCheckin, games) {
  let sprint=0,strength=0,consistency=0,soccer=0;
  if (latestCheckin?.sprint_40m) sprint=Math.min(100,Math.round(Math.max(0,(6.0-latestCheckin.sprint_40m)/1.6*100)));
  if (latestCheckin?.bench_lbs&&player.weight_lbs) strength=Math.min(100,Math.round(Math.min((latestCheckin.bench_lbs/player.weight_lbs)/1.5,1)*100));
  if (latestCheckin?.days_completed) consistency=Math.min(100,Math.round((latestCheckin.days_completed/7)*100));
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
