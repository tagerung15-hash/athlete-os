// src/lib/config.js
// All position-adaptive logic lives here

export const POSITIONS = {
  striker: {
    label: 'Striker',
    emoji: '⚽',
    color: '#E24B4A',
    colorLight: '#FCEBEB',
    tagline: 'Speed · Finishing · Pressing',
    sprintFocus: 'Acceleration + Repeat Sprint Ability',
    strengthFocus: 'Explosive Power — Squats, RDLs, Single-Leg',
    enduranceFocus: 'High-intensity intervals, press-reset-press',
    agilityFocus: 'L-drill, reaction sprints, deceleration',
    weeklyThemes: ['Acceleration','Finishing','Strength PRs','DELOAD','Max Velocity','Agility','Soccer Integration','DELOAD','Game Speed','Arm Peak','Sprint PR','DELOAD + Evaluate'],
    gameStats: ['goals','shots','shots_on_target','press_att','press_won'],
    gameStatLabels: {goals:'Goals',shots:'Shots',shots_on_target:'Shots on Target',press_att:'Presses Attempted',press_won:'Presses Won'},
    kpis: ['Goals/game','Shot accuracy %','Press win %','Sprint recovery time'],
    nutritionMultiplier: 1.0,
    carbTiming: 'High carbs pre-match and post-sprint. Moderate on gym days.',
    sprintSessions: [
      {phase:'Pure Speed',reps:[{dist:'30m',sets:4,effort:'95-100%',rest:'2.5 min'},{dist:'60m',sets:4,effort:'90-95%',rest:'3 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'150m',sets:3,effort:'85-90%',rest:'90s'},{dist:'100m',sets:4,effort:'88-92%',rest:'75s'}]},
      {phase:'Game Sim',reps:[{dist:'40m dead legs',sets:6,effort:'Max',rest:'25-30s'}]},
    ],
  },
  winger: {
    label: 'Winger',
    emoji: '⚡',
    color: '#BA7517',
    colorLight: '#FAEEDA',
    tagline: 'Max Velocity · Agility · Explosiveness',
    sprintFocus: 'Top-end speed + 1v1 acceleration',
    strengthFocus: 'Unilateral power — Split squats, single-leg RDL',
    enduranceFocus: 'Repeated high-speed runs with full recovery',
    agilityFocus: 'T-drill, box agility, direction change under pressure',
    weeklyThemes: ['Top-End Speed','Dribbling + Agility','Strength Power','DELOAD','Max Velocity','1v1 Scenarios','Cross + Finish','DELOAD','Game Speed','Sprint PRs','Explosive Peak','DELOAD + Evaluate'],
    gameStats: ['chances_created','crosses','dribbles_won','press_att','goals'],
    gameStatLabels: {chances_created:'Chances Created',crosses:'Crosses',dribbles_won:'Dribbles Won',press_att:'Presses',goals:'Goals'},
    kpis: ['Dribble success %','Chances created/game','Crosses completed','Max sprint speed'],
    nutritionMultiplier: 1.0,
    carbTiming: 'Very high carbs on track/sprint days. Moderate on gym days.',
    sprintSessions: [
      {phase:'Pure Speed',reps:[{dist:'20m',sets:6,effort:'100%',rest:'2 min'},{dist:'40m',sets:4,effort:'95%',rest:'2.5 min'}]},
      {phase:'Speed Endurance',reps:[{dist:'80m',sets:5,effort:'90%',rest:'75s'},{dist:'120m',sets:3,effort:'87%',rest:'90s'}]},
      {phase:'Game Sim',reps:[{dist:'30m',sets:8,effort:'Max',rest:'20s'}]},
    ],
  },
  midfielder_cm: {
    label: 'Central Midfielder',
    emoji: '🔄',
    color: '#185FA5',
    colorLight: '#E6F1FB',
    tagline: 'Endurance · Work Rate · Box-to-Box',
    sprintFocus: 'Repeated sprints with short recovery — 10-12km/game pace',
    strengthFocus: 'Balanced — Squat, Bench, Pull-ups, Core',
    enduranceFocus: 'Zone 2 aerobic base + anaerobic intervals',
    agilityFocus: '5-10-5 shuttle, reaction, quick direction changes',
    weeklyThemes: ['Aerobic Base','Box-to-Box Endurance','Strength Balance','DELOAD','Tempo Intervals','Agility + Reaction','Full Integration','DELOAD','Game Fitness','Strength PRs','Sprint Endurance','DELOAD + Evaluate'],
    gameStats: ['passes','pass_acc','chances_created','distance_km','press_att'],
    gameStatLabels: {passes:'Passes',pass_acc:'Pass Accuracy %',chances_created:'Chances Created',distance_km:'Distance (km)',press_att:'Presses'},
    kpis: ['Distance covered/game','Pass accuracy %','Chances created','Sprints per game'],
    nutritionMultiplier: 1.05,
    carbTiming: 'High carbs on all training days. Prioritize intra-session carbs on long sessions.',
    sprintSessions: [
      {phase:'Tempo Endurance',reps:[{dist:'200m',sets:6,effort:'80%',rest:'60s'},{dist:'400m',sets:3,effort:'75%',rest:'2 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'90%',rest:'30s'},{dist:'60m',sets:5,effort:'87%',rest:'45s'}]},
      {phase:'Game Sim',reps:[{dist:'40m',sets:10,effort:'85%',rest:'20s'}]},
    ],
  },
  midfielder_dm: {
    label: 'Defensive Midfielder',
    emoji: '🛡',
    color: '#185FA5',
    colorLight: '#E6F1FB',
    tagline: 'Physicality · Endurance · Winning Duels',
    sprintFocus: 'Short explosive bursts + covering sprints (5-15m)',
    strengthFocus: 'Strength-dominant — Squat, Deadlift, Physical presence',
    enduranceFocus: 'High-intensity repeats with aerobic base',
    agilityFocus: '5-10-5 shuttle, tackle positioning, reaction',
    weeklyThemes: ['Physical Base','Duel Strength','Explosive Endurance','DELOAD','Strength Peak','Aerobic Top-Up','Full Integration','DELOAD','Game Fitness','Strength PRs','Explosive Peak','DELOAD + Evaluate'],
    gameStats: ['passes','tackles','interceptions','distance_km','duels_won'],
    gameStatLabels: {passes:'Passes',tackles:'Tackles',interceptions:'Interceptions',distance_km:'Distance (km)',duels_won:'Duels Won'},
    kpis: ['Tackles/game','Interceptions/game','Duel win %','Distance covered'],
    nutritionMultiplier: 1.05,
    carbTiming: 'Moderate-high carbs. Extra protein for physical recovery.',
    sprintSessions: [
      {phase:'Explosive Bursts',reps:[{dist:'10m',sets:10,effort:'100%',rest:'60s'},{dist:'20m',sets:8,effort:'97%',rest:'90s'}]},
      {phase:'Repeat Speed',reps:[{dist:'30m',sets:6,effort:'90%',rest:'40s'},{dist:'60m',sets:4,effort:'87%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'300m',sets:4,effort:'75%',rest:'90s'}]},
    ],
  },
  defender_cb: {
    label: 'Centre Back',
    emoji: '🧱',
    color: '#5B3FA8',
    colorLight: '#EEEDFE',
    tagline: 'Strength · Aerial · Short Bursts',
    sprintFocus: 'Explosive 5-20m bursts + recovery sprints',
    strengthFocus: 'Maximum strength — Deadlift, Squat, Upper body power',
    enduranceFocus: 'Moderate aerobic base, high-intensity short intervals',
    agilityFocus: 'Backpedal + plant, T-drill, aerial positioning',
    weeklyThemes: ['Strength Foundation','Aerial Dominance','Short-Burst Speed','DELOAD','Max Strength','Defensive Agility','Full Integration','DELOAD','Game Fitness','Strength Peak','Explosive Power','DELOAD + Evaluate'],
    gameStats: ['tackles','interceptions','clearances','aerial_won','pass_acc'],
    gameStatLabels: {tackles:'Tackles',interceptions:'Interceptions',clearances:'Clearances',aerial_won:'Aerials Won',pass_acc:'Pass Accuracy %'},
    kpis: ['Aerial duel %','Tackles/game','Clearances/game','Pass accuracy %'],
    nutritionMultiplier: 1.02,
    carbTiming: 'Moderate carbs. Protein-forward on heavy gym days.',
    sprintSessions: [
      {phase:'Explosive Power',reps:[{dist:'10m',sets:8,effort:'100%',rest:'90s'},{dist:'20m',sets:6,effort:'97%',rest:'2 min'}]},
      {phase:'Recovery Sprints',reps:[{dist:'30m',sets:5,effort:'90%',rest:'60s'}]},
      {phase:'Endurance Base',reps:[{dist:'200m',sets:4,effort:'75%',rest:'90s'}]},
    ],
  },
  defender_fb: {
    label: 'Full Back',
    emoji: '🔀',
    color: '#5B3FA8',
    colorLight: '#EEEDFE',
    tagline: 'Endurance · Speed · Overlap Runs',
    sprintFocus: 'Repeated high-speed runs down the flank — overlap + recovery',
    strengthFocus: 'Balanced power — Squat, Unilateral, Upper body',
    enduranceFocus: 'High total distance + sprint recovery ability',
    agilityFocus: 'Direction change, overlap timing, defensive transitions',
    weeklyThemes: ['Aerobic Base','Overlap Speed','Strength Balance','DELOAD','Repeat Speed','Defensive Agility','Full Integration','DELOAD','Game Fitness','Sprint PRs','Endurance Peak','DELOAD + Evaluate'],
    gameStats: ['tackles','crosses','chances_created','distance_km','dribbles_won'],
    gameStatLabels: {tackles:'Tackles',crosses:'Crosses',chances_created:'Chances Created',distance_km:'Distance (km)',dribbles_won:'Dribbles Won'},
    kpis: ['Distance covered/game','Crosses completed','Tackles/game','Sprint recovery time'],
    nutritionMultiplier: 1.05,
    carbTiming: 'High carbs on sprint/track days. Moderate on gym days.',
    sprintSessions: [
      {phase:'Flank Speed',reps:[{dist:'40m',sets:5,effort:'95%',rest:'2 min'},{dist:'60m',sets:3,effort:'90%',rest:'2.5 min'}]},
      {phase:'Repeat Sprints',reps:[{dist:'30m',sets:8,effort:'88%',rest:'35s'},{dist:'50m',sets:5,effort:'85%',rest:'45s'}]},
      {phase:'Game Sim',reps:[{dist:'40m',sets:8,effort:'Max',rest:'25s'}]},
    ],
  },
  goalkeeper: {
    label: 'Goalkeeper',
    emoji: '🧤',
    color: '#1D9E75',
    colorLight: '#E1F5EE',
    tagline: 'Power · Reaction · Mobility',
    sprintFocus: 'Short explosive bursts (2-6m) + diving power',
    strengthFocus: 'Upper body power + core — Press, Pull, Rotational',
    enduranceFocus: 'Minimal cardio — focus on power and reaction training',
    agilityFocus: 'Lateral shuffle, dive + recovery, reaction drills',
    weeklyThemes: ['Reaction Training','Diving Mechanics','Upper Body Power','DELOAD','Lateral Explosiveness','Shot-Stopping IQ','Full Integration','DELOAD','Distribution Power','Strength Peak','Reflex Training','DELOAD + Evaluate'],
    gameStats: ['saves','goals_conceded','distribution_acc','claims','sweeper_actions'],
    gameStatLabels: {saves:'Saves',goals_conceded:'Goals Conceded',distribution_acc:'Distribution Acc %',claims:'Claims',sweeper_actions:'Sweeper Actions'},
    kpis: ['Save percentage','Goals conceded/game','Distribution accuracy','Claim success %'],
    nutritionMultiplier: 0.92,
    carbTiming: 'Moderate carbs. High protein for upper body development.',
    sprintSessions: [
      {phase:'Explosive Bursts',reps:[{dist:'5m',sets:10,effort:'100%',rest:'60s'},{dist:'10m',sets:8,effort:'100%',rest:'90s'}]},
      {phase:'Lateral Power',reps:[{dist:'5m lateral',sets:8,effort:'100%',rest:'60s'}]},
      {phase:'Reaction Sprints',reps:[{dist:'10m on signal',sets:10,effort:'100%',rest:'45s'}]},
    ],
  },
};

export const GYM_FOCUSES = {
  hypertrophy: {
    label: 'Size (Hypertrophy)',
    sets: '3–4', reps: '8–12', rest: '60–90s', tempo: '2/1/2',
    proteinMultiplier: 1.0, calMultiplier: 1.08,
    emphasis: 'Volume-driven. Progressive overload every session. Arm finisher mandatory.',
  },
  strength: {
    label: 'Strength',
    sets: '4–5', reps: '3–6', rest: '2–3 min', tempo: '3/1/2',
    proteinMultiplier: 0.95, calMultiplier: 1.05,
    emphasis: 'Heavy compound lifts. Neural adaptation. Max effort on primary lifts.',
  },
  lean_athletic: {
    label: 'Lean Athletic',
    sets: '3', reps: '10–15', rest: '45–60s', tempo: '2/0/2',
    proteinMultiplier: 1.0, calMultiplier: 0.98,
    emphasis: 'Supersets and circuits. Maintain muscle, burn fat. Athletic aesthetics.',
  },
  speed_power: {
    label: 'Speed / Power',
    sets: '3–4', reps: '4–6', rest: '2–3 min', tempo: 'Explosive',
    proteinMultiplier: 0.9, calMultiplier: 1.02,
    emphasis: 'Plyometrics + Olympic-style lifts. Power cleans, box jumps, bounds.',
  },
  maintenance: {
    label: 'Maintenance',
    sets: '3', reps: '8–12', rest: '60–90s', tempo: '2/1/2',
    proteinMultiplier: 0.85, calMultiplier: 0.95,
    emphasis: 'Keep what you have. Lower volume, consistent effort.',
  },
};

export const BODY_GOALS = {
  gain: { label: 'Gain Muscle', calAdjust: +300, note: 'Lean bulk — ~0.5 lb/week target gain' },
  maintain: { label: 'Maintain', calAdjust: 0, note: 'Body recomposition — strength up, fat neutral' },
  cut: { label: 'Cut / Lean Out', calAdjust: -300, note: 'Preserve muscle while losing fat — high protein critical' },
};

// Nutrition calculator
export function calcNutrition(player) {
  const { weight_lbs = 175, position, gym_focus, body_goal } = player;
  const pos = POSITIONS[position] || POSITIONS.striker;
  const gym = GYM_FOCUSES[gym_focus] || GYM_FOCUSES.hypertrophy;
  const goal = BODY_GOALS[body_goal] || BODY_GOALS.maintain;

  const baseCal = Math.round(weight_lbs * 17 * pos.nutritionMultiplier * gym.calMultiplier);
  const totalCal = baseCal + goal.calAdjust;
  const protein = Math.round(weight_lbs * gym.proteinMultiplier);
  const fat = Math.round(weight_lbs * 0.45);
  const carbs = Math.round((totalCal - protein * 4 - fat * 9) / 4);

  return { calories: totalCal, protein, carbs, fat, note: goal.note, carbTiming: pos.carbTiming };
}

// Superhuman score (position-aware)
export function calcScore(player, latestCheckin, games) {
  let sprint = 0, strength = 0, consistency = 0, soccer = 0;
  const pos = POSITIONS[player.position] || POSITIONS.striker;

  if (latestCheckin?.sprint_40m) {
    sprint = Math.min(100, Math.round(Math.max(0, (6.0 - latestCheckin.sprint_40m) / (6.0 - 4.4) * 100)));
  }
  if (latestCheckin?.bench_lbs && player.weight_lbs) {
    strength = Math.min(100, Math.round(Math.min((latestCheckin.bench_lbs / player.weight_lbs) / 1.5, 1) * 100));
  }
  if (latestCheckin?.days_completed) {
    consistency = Math.min(100, Math.round((latestCheckin.days_completed / 7) * 100));
  }

  if (games && games.length >= 2) {
    // Position-specific soccer score
    if (player.position === 'striker') {
      const pressAtt = games.reduce((s, g) => s + (g.stats?.press_att || 0), 0);
      const pressWon = games.reduce((s, g) => s + (g.stats?.press_won || 0), 0);
      const shots = games.reduce((s, g) => s + (g.stats?.shots || 0), 0);
      const sot = games.reduce((s, g) => s + (g.stats?.shots_on_target || 0), 0);
      const pr = pressAtt > 0 ? pressWon / pressAtt : 0;
      const sr = shots > 0 ? sot / shots : 0;
      soccer = Math.round((pr * 0.5 + sr * 0.5) * 100);
    } else if (['midfielder_cm', 'midfielder_dm'].includes(player.position)) {
      const passAccs = games.filter(g => g.stats?.pass_acc).map(g => g.stats.pass_acc);
      soccer = passAccs.length ? Math.round(passAccs.reduce((a, b) => a + b, 0) / passAccs.length) : 0;
    } else if (['defender_cb', 'defender_fb'].includes(player.position)) {
      const tackles = games.reduce((s, g) => s + (g.stats?.tackles || 0), 0);
      soccer = Math.min(100, Math.round((tackles / games.length) * 10));
    } else if (player.position === 'goalkeeper') {
      const saves = games.reduce((s, g) => s + (g.stats?.saves || 0), 0);
      const conceded = games.reduce((s, g) => s + (g.stats?.goals_conceded || 0), 0);
      soccer = Math.min(100, Math.round((saves / (saves + conceded + 1)) * 100));
    } else {
      const ratings = games.filter(g => g.self_rating).map(g => g.self_rating);
      soccer = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) : 0;
    }
  }

  const hasSoccer = games && games.length >= 2;
  const total = hasSoccer
    ? Math.round(sprint * 0.35 + strength * 0.25 + consistency * 0.25 + soccer * 0.15)
    : Math.round(sprint * 0.4 + strength * 0.3 + consistency * 0.3);

  return { total, sprint, strength, consistency, soccer, hasSoccer };
}
