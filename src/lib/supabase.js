// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env vars. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Teams ──────────────────────────────────────────────────────────────────
export async function getTeamByCode(code) {
  const { data, error } = await supabase
    .from('teams').select('*').eq('team_code', code.toUpperCase()).single();
  return { data, error };
}

export async function getTeamByCoachCode(code) {
  const { data, error } = await supabase
    .from('teams').select('*').eq('coach_code', code.toUpperCase()).single();
  return { data, error };
}

export async function createTeam(name) {
  const teamCode = Math.random().toString(36).slice(2,7).toUpperCase();
  const coachCode = 'COACH-' + Math.random().toString(36).slice(2,6).toUpperCase();
  const { data, error } = await supabase
    .from('teams').insert({ name, team_code: teamCode, coach_code: coachCode }).select().single();
  return { data, error };
}

// ── Players ────────────────────────────────────────────────────────────────
export async function getPlayersByTeam(teamId) {
  const { data, error } = await supabase
    .from('players').select('*').eq('team_id', teamId).order('created_at');
  return { data, error };
}

export async function getPlayerByNamePin(teamId, name, pin) {
  const { data, error } = await supabase
    .from('players').select('*')
    .eq('team_id', teamId).ilike('name', name).eq('pin', pin).single();
  return { data, error };
}

export async function createPlayer(teamId, profile) {
  const { data, error } = await supabase
    .from('players').insert({ team_id: teamId, ...profile }).select().single();
  return { data, error };
}

export async function updatePlayer(id, updates) {
  const { data, error } = await supabase
    .from('players').update(updates).eq('id', id).select().single();
  return { data, error };
}

// ── Check-ins ──────────────────────────────────────────────────────────────
export async function saveCheckin(playerId, checkin) {
  const { data, error } = await supabase
    .from('checkins').upsert({ player_id: playerId, ...checkin }, { onConflict: 'player_id,week_date' }).select().single();
  return { data, error };
}

export async function getCheckins(playerId, limit = 12) {
  const { data, error } = await supabase
    .from('checkins').select('*').eq('player_id', playerId)
    .order('week_date', { ascending: false }).limit(limit);
  return { data, error };
}

export async function getLatestCheckin(playerId) {
  const { data, error } = await supabase
    .from('checkins').select('*').eq('player_id', playerId)
    .order('week_date', { ascending: false }).limit(1).single();
  return { data, error };
}

// ── Game logs ──────────────────────────────────────────────────────────────
export async function saveGame(playerId, game) {
  const { data, error } = await supabase
    .from('game_logs').insert({ player_id: playerId, ...game }).select().single();
  return { data, error };
}

export async function getGames(playerId, limit = 20) {
  const { data, error } = await supabase
    .from('game_logs').select('*').eq('player_id', playerId)
    .order('game_date', { ascending: false }).limit(limit);
  return { data, error };
}

// ── Lift logs ──────────────────────────────────────────────────────────────
export async function saveLiftLog(playerId, lifts) {
  const rows = lifts.map(l => ({ player_id: playerId, ...l }));
  const { data, error } = await supabase.from('lift_logs').insert(rows).select();
  return { data, error };
}

export async function getLiftLogs(playerId, limit = 50) {
  const { data, error } = await supabase
    .from('lift_logs').select('*').eq('player_id', playerId)
    .order('logged_at', { ascending: false }).limit(limit);
  return { data, error };
}

// ── Measurements ───────────────────────────────────────────────────────────
export async function saveMeasurement(playerId, m) {
  const { data, error } = await supabase
    .from('measurements').upsert({ player_id: playerId, ...m }, { onConflict: 'player_id,measured_at' }).select().single();
  return { data, error };
}

export async function getMeasurements(playerId) {
  const { data, error } = await supabase
    .from('measurements').select('*').eq('player_id', playerId)
    .order('measured_at');
  return { data, error };
}

// ── Coach: bulk team data ──────────────────────────────────────────────────
export async function getTeamSnapshot(teamId) {
  const { data: players } = await getPlayersByTeam(teamId);
  if (!players) return { players: [], checkins: {}, games: {} };

  const ids = players.map(p => p.id);

  const { data: allCheckins } = await supabase
    .from('checkins').select('*').in('player_id', ids)
    .order('week_date', { ascending: false });

  const { data: allGames } = await supabase
    .from('game_logs').select('*').in('player_id', ids)
    .order('game_date', { ascending: false });

  // Group by player
  const checkinsByPlayer = {};
  const gamesByPlayer = {};
  ids.forEach(id => {
    checkinsByPlayer[id] = (allCheckins || []).filter(c => c.player_id === id);
    gamesByPlayer[id] = (allGames || []).filter(g => g.player_id === id);
  });

  return { players, checkinsByPlayer, gamesByPlayer };
}
