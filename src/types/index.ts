import raw from '../data/dashboard_data.json'
export type Stats = Record<string, number | null>
export type Player = { rank:number; pid:number; name:string; score:number; pressure_value:number; everyday_skill:number; stepup:number; consistency_raw:number; consistency_smoothed:number; pressure_balls:number; pressure_innings:number; positive_innings:number; top10_prob:number; rank_p10:number; rank_p90:number; pressure:Stats; normal:Stats; comp:Record<string,Stats>; innings:Record<string,Stats>; phase:Record<string,Stats>; wickets_context:Record<string,Stats>; season:Record<string,Stats>; match_series:{date:string;value:number;balls:number;comp:string}[]; percentiles:Record<string,number>; strengths:string[]; weaknesses:string[] }
export type BoardRow = {rank:number;pid?:number;name:string;score:number;pressure_value:number;consistency:number;stepup:number;pressure_balls:number;pressure_innings:number;top10_prob:number;[key:string]:string|number|undefined}
export type Dataset = typeof raw
export const data = raw as unknown as Dataset
export const batters = data.players.bat as unknown as Player[]
export const bowlers = data.players.bowl as unknown as Player[]
export const allBatters = data.leaderboard.bat as unknown as BoardRow[]
export const allBowlers = data.leaderboard.bowl as unknown as BoardRow[]
