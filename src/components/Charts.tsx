import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import type { ReactNode } from 'react'
import { Card } from './Card'

export const firstName = (name: string) => name.split(' ')[0]
export const tipStyle = { border: '1px solid #e7eaf0', borderRadius: 12, boxShadow: '0 8px 28px #0b1f4b14', fontSize: 12 }

export function ChartCard({ title, caption, children, action }: { title: string; caption: string; children: ReactNode; action?: ReactNode }) {
  return <Card title={title} subtitle={caption} action={action} className="chart-card" bodyClassName="chart-card-body">{children}</Card>
}

export function PressureBars({ rows, metric = 'pressure_value', color = '#e6007e' }: { rows: any[]; metric?: string; color?: string }) {
  if (!rows.length) return <div className="empty-chart">No data</div>
  const data = rows.map((row) => ({ ...row, name: firstName(row.name), fullName: row.name }))
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 2 }}><CartesianGrid horizontal={false} strokeDasharray="3 3"/><XAxis type="number" tick={{ fontSize: 10 }}/><YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }}/><Tooltip contentStyle={tipStyle} formatter={(value: any) => [Number(value).toFixed(1), 'Pressure value']} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}/><Bar dataKey={metric} name="Pressure value" fill={color} radius={[0, 5, 5, 0]} barSize={13}><LabelList dataKey={metric} position="right" formatter={(value: any) => Number(value).toFixed(1)} style={{ fontSize: 10 }}/></Bar></BarChart></ResponsiveContainer>
}

export function MetricLineChart({ data, series, colors = ['#e6007e', '#284d85'], x = 'name' }: { data: any[]; series: string[]; colors?: string[]; x?: string }) {
  if (!data.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey={x} tick={{ fontSize: 12 }} interval={0}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={tipStyle}/>{series.map((key, index) => <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2.5} dot={{ r: 3 }} connectNulls/>)}</LineChart></ResponsiveContainer>
}

export function SplitBars({ rows }: { rows: any[] }) {
  const data = rows
    .map((row) => ({
      ...row,
      name: row.fullName ?? row.name,
      IPL: Number(row.IPL ?? 0),
      T20I: Number(row.T20I ?? 0),
      total: Number(row.IPL ?? 0) + Number(row.T20I ?? 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
  if (!data.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 8, right: 22, top: 18, bottom: 18 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f4"/><XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Pressure balls', position: 'insideBottom', offset: -10 }}/><YAxis type="category" dataKey="name" width={118} interval={0} tick={{ fontSize: 10 }} tickLine={false}/><Tooltip contentStyle={tipStyle} content={({ active, payload }) => {
    if (!active || !payload?.length) return null
    const p = payload[0].payload
    return <div style={{ ...tipStyle, background: '#fff', padding: 10 }}><strong>{p.name}</strong><div>IPL pressure balls: {p.IPL}</div><div>T20I pressure balls: {p.T20I}</div><div>Total pressure balls: {p.total}</div></div>
  }}/><Legend verticalAlign="top" height={28}/><Bar dataKey="IPL" name="IPL pressure balls" stackId="competition" fill="#E6007E" barSize={16}/><Bar dataKey="T20I" name="T20I pressure balls" stackId="competition" fill="#3B82F6" barSize={16}/></BarChart></ResponsiveContainer>
}

export function ConsistencyScatter({ rows, all }: { rows: any[]; all: any[] }) {
  const featuredNames = new Set(rows.map((row) => row.name))
  const eligible = all.filter((player) => Number.isFinite(player.consistency) && Number.isFinite(player.pressure_value))
  const background = eligible.filter((player) => !featuredNames.has(player.name)).map((player) => ({ ...player, name: firstName(player.name), fullName: player.name, size: player.pressure_balls }))
  const featured = eligible.filter((player) => featuredNames.has(player.name)).map((player) => ({ ...player, name: firstName(player.name), fullName: player.name, size: player.pressure_balls }))
  if (!eligible.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ left: 8, right: 20, top: 12, bottom: 12 }}><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" dataKey="consistency" name="Consistency" tick={{ fontSize: 10 }}/><YAxis type="number" dataKey="pressure_value" name="Pressure value" tick={{ fontSize: 10 }}/><Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tipStyle} formatter={(value: any, name: string) => [typeof value === 'number' ? value.toFixed(2) : value, name]} labelFormatter={(_, payload) => { const p = payload?.[0]?.payload; return p ? `${p.fullName} · rank ${p.rank} · score ${Number(p.score).toFixed(2)} · pressure value ${Number(p.pressure_value).toFixed(1)} · consistency ${Number(p.consistency).toFixed(1)}` : '' }}/><ZAxis type="number" dataKey="size" range={[48, 170]} zAxisId="size"/><Scatter name="Eligible players" data={background} fill="#aab3c3" zAxisId="size"/><Scatter name="Top 10" data={featured} fill="#E6007E" shape="circle" zAxisId="size"><LabelList dataKey="name" position="right" style={{ fontSize: 9 }}/></Scatter></ScatterChart></ResponsiveContainer>
}

export function RankedRange({ rows }: { rows: any[] }) {
  const data = rows
    .filter((player) => Number.isFinite(player.rank_p10) && Number.isFinite(player.rank_p90))
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
    .map((player) => ({
      ...player,
      name: player.name,
      fullName: player.name,
      base: Number(player.rank_p10),
      span: Math.max(0, Number(player.rank_p90) - Number(player.rank_p10)),
    }))
  if (!data.length) return <div className="empty-chart">No data</div>
  const axisMax = Math.max(40, ...data.flatMap((p) => [p.rank_p10, p.rank_p90, p.rank]))
  return <ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 28 }}><CartesianGrid horizontal={false} stroke="#edf0f4"/><XAxis type="number" domain={[1, axisMax]} tickCount={6} tick={{ fontSize: 10 }} label={{ value: 'Rank (1 = Best)', position: 'insideBottom', offset: -18 }}/><YAxis type="category" dataKey="name" width={118} interval={0} tick={{ fontSize: 10 }} tickLine={false}/><Tooltip contentStyle={tipStyle} content={({ active, payload }) => {
    if (!active || !payload?.length) return null
    const p = payload[0].payload
    return <div style={{ ...tipStyle, background: '#fff', padding: 10 }}><strong>{p.fullName}</strong><div>Final rank: {p.rank}</div><div>10th percentile rank: {p.rank_p10}</div><div>90th percentile rank: {p.rank_p90}</div><div>Top-10 probability: {p.top10_prob == null ? 'N/A' : (Number(p.top10_prob) * 100).toFixed(1) + '%'}</div></div>
  }}/><Bar dataKey="base" stackId="range" fill="transparent" isAnimationActive={false}/><Bar dataKey="span" stackId="range" fill="#F4A6CF" radius={6} barSize={11} isAnimationActive={false}/><Scatter dataKey="rank" fill="#E6007E" shape="circle" isAnimationActive={false}/></ComposedChart></ResponsiveContainer>
}

export function InningsComparisonChart({ rows }: { rows: any[] }) {
  const data = rows.map((row) => ({
    ...row,
    name: row.fullName ?? row.name,
    'First innings': Number(row['First innings'] ?? row['1st innings'] ?? 0),
    Chase: Number(row.Chase ?? 0),
  })).filter((row) => Number.isFinite(row['First innings']) && Number.isFinite(row.Chase))
  if (!data.length) return <div className="empty-chart">No data</div>
  const values = data.flatMap((row) => [row['First innings'], row.Chase])
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values)
  const pad = Math.max(1, (high - low) * 0.12)
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 18 }} barCategoryGap="22%"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f4"/><XAxis type="number" domain={[low - pad, high + pad]} tick={{ fontSize: 10 }} label={{ value: 'Raw performance value / 100 balls', position: 'insideBottom', offset: -10 }}/><YAxis type="category" dataKey="name" width={118} interval={0} tick={{ fontSize: 10 }} tickLine={false}/><ReferenceLine x={0} stroke="#102653" strokeWidth={1.5}/><Tooltip contentStyle={tipStyle} labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''} formatter={(value: any, name: string) => [Number(value).toFixed(2), name]}/><Legend verticalAlign="top" height={28}/><Bar dataKey="First innings" name="First innings" fill="#3B82F6" barSize={10}/><Bar dataKey="Chase" name="Chase" fill="#E6007E" barSize={10}/></BarChart></ResponsiveContainer>
}

export function PressureNormalComparisonChart({ rows }: { rows: any[] }) {
  const data = rows.map((row) => ({
    ...row,
    name: row.fullName ?? row.name,
    Pressure: Number(row.Pressure ?? 0),
    Normal: Number(row.Normal ?? 0),
  }))
  if (!data.length) return <div className="empty-chart">No data</div>
  const values = data.flatMap((row) => [row.Pressure, row.Normal])
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values)
  const pad = Math.max(1, (high - low) * 0.12)
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 18 }} barCategoryGap="22%"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f4"/><XAxis type="number" domain={[low - pad, high + pad]} tick={{ fontSize: 10 }} label={{ value: 'Performance value', position: 'insideBottom', offset: -10 }}/><YAxis type="category" dataKey="name" width={118} interval={0} tick={{ fontSize: 10 }} tickLine={false}/><ReferenceLine x={0} stroke="#102653" strokeWidth={1.5}/><Tooltip contentStyle={tipStyle} formatter={(value: any, name: string) => [Number(value).toFixed(2), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''}/><Legend verticalAlign="top" height={28}/><Bar dataKey="Pressure" fill="#E6007E" barSize={10}/><Bar dataKey="Normal" fill="#102653" barSize={10}/></BarChart></ResponsiveContainer>
}

function comparisonAxis(values: number[]) {
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values)
  const roughStep = (high - low) / 4 || 1
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const fraction = roughStep / magnitude
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude
  const min = low < 0 ? Math.floor(low / step) * step : 0
  const max = high > 0 ? Math.ceil(high / step) * step : 0
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step)
  return { domain: [min, max] as [number, number], ticks }
}

export function PlayerComparisonPressureNormalChart({ rows }: { rows: any[] }) {
  const data = rows.map((row) => ({
    ...row,
    name: row.fullName ?? row.name,
    Pressure: Number(row.Pressure),
    Normal: Number(row.Normal),
  }))
  if (!data.length) return <div className="empty-chart">No data</div>
  const { domain, ticks } = comparisonAxis(data.flatMap((row) => [row.Pressure, row.Normal]))
  const labelWidth = Math.min(170, Math.max(132, ...data.map((row) => String(row.name).length * 6.5 + 12)))
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 4, right: 10, top: 2, bottom: 8 }} barCategoryGap="14%" barGap={4}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f4"/><XAxis type="number" domain={domain} ticks={ticks} tickFormatter={(value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })} tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={labelWidth} interval={0} tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>{domain[0] < 0 && <ReferenceLine x={0} stroke="#102653" strokeWidth={1.5}/>}<Tooltip contentStyle={tipStyle} formatter={(value: any, name: string) => [String(value), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''}/><Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11 }}/><Bar dataKey="Normal" name="Normal" fill="#102653" barSize={18} radius={[0, 4, 4, 0]}/><Bar dataKey="Pressure" name="Pressure" fill="#E6007E" barSize={18} radius={[0, 4, 4, 0]}/></BarChart></ResponsiveContainer>
}

export function PlayerRadarComparison({ players, normalizationPlayers = players }: { players: any[]; normalizationPlayers?: any[] }) {
  if (players.length < 2) return <div className="empty-chart">Select at least two players</div>
  const keys = [
    ['Pressure value', 'pressure_value'],
    ['Overall score', 'score'],
    ['Everyday skill', 'everyday_skill'],
    ['Step-up performance', 'stepup'],
    ['Consistency', 'consistency_raw'],
    ['Top-10 stability', 'top10_prob'],
  ] as const
  const colors = ['#E6007E', '#3B82F6', '#10B981', '#F59E0B']
  const radar = keys.map(([label, key]) => {
    const values = normalizationPlayers.map((player) => Number(player[key] ?? 0)).filter(Number.isFinite)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const point: any = { metric: label, key }
    players.forEach((player) => {
      const original = Number(player[key] ?? 0)
      point[player.name] = !Number.isFinite(original) ? 0 : max === min ? 50 : ((original - min) / (max - min)) * 100
      point[`${player.name}__original`] = original
    })
    return point
  })
  if (players.length > 2) {
    return <ResponsiveContainer width="100%" height="100%"><BarChart data={radar} layout="vertical" margin={{ left: 8, right: 14, top: 34, bottom: 16 }} barCategoryGap="22%" barGap={2}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f4"/><XAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="metric" width={120} interval={0} tick={{ fontSize: 9 }} tickLine={false} axisLine={false}/><Tooltip contentStyle={tipStyle} content={({ active, payload }) => {
      if (!active || !payload?.length) return null
      const row = payload[0].payload
      return <div style={{ ...tipStyle, background: '#fff', padding: 10 }}><strong>{row.metric}</strong>{players.map((player, index) => <div key={player.pid}><span style={{ color: colors[index] }}>{player.name}: </span>{String(row[`${player.name}__original`])}</div>)}</div>
    }}/><Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 10 }}/>{players.map((player, index) => <Bar key={player.pid} dataKey={player.name} name={player.name} fill={colors[index]} barSize={players.length === 4 ? 8 : 11} radius={[0, 3, 3, 0]}/>)}</BarChart></ResponsiveContainer>
  }
  return <ResponsiveContainer width="100%" height="100%"><RadarChart data={radar} outerRadius="80%" margin={{ top: 20, right: 34, bottom: 24, left: 34 }}><PolarGrid gridType="circle" stroke="#d5dce7" strokeWidth={1}/><PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#56647a' }}/><PolarRadiusAxis domain={[0, 100]} ticks={[20, 40, 60, 80, 100]} tick={{ fontSize: 8, fill: '#7b879a' }} tickLine={false} axisLine={false}/><Tooltip contentStyle={tipStyle} content={({ active, payload }) => {
    if (!active || !payload?.length) return null
    const row = payload[0].payload
    return <div style={{ ...tipStyle, background: '#fff', padding: 10 }}><strong>{row.metric}</strong>{players.map((player) => {
      const original = row[`${player.name}__original`]
      return <div key={player.pid}><span style={{ color: colors[players.indexOf(player)] }}>{player.name}: </span>{String(original)}</div>
    })}</div>
  }}/><Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 10 }}/>{players.map((player, index) => <Radar key={player.pid} name={player.name} dataKey={player.name} stroke={colors[index]} fill={colors[index]} fillOpacity={0.1} strokeWidth={2} dot={{ r: 4, stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} isAnimationActive={false}/>)}</RadarChart></ResponsiveContainer>
}

export function DataBars({ rows, metric }: { rows: any[]; metric: string }) {
  if (!rows.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={rows.map((row) => ({ ...row, name: firstName(row.name), fullName: row.name }))} margin={{ left: 4, right: 14, top: 10, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={tipStyle} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}/><Bar dataKey={metric} fill="#e6007e" radius={[5, 5, 0, 0]}>{rows.map((row, index) => <Cell key={`${row.name}${index}`} fill={row[metric] >= 0 ? '#e6007e' : '#ed7070'}/>)}</Bar></BarChart></ResponsiveContainer>
}
