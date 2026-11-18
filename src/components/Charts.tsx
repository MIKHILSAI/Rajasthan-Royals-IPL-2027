import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
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
  if (!rows.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ left: 14, right: 12, top: 8, bottom: 22 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0}/><YAxis tick={{ fontSize: 10 }} label={{ value: 'Pressure balls', angle: -90, position: 'insideLeft' }}/><Tooltip contentStyle={tipStyle} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}/><Legend/><Bar dataKey="IPL" stackId="a" fill="#E6007E"/><Bar dataKey="T20I" stackId="a" fill="#3B82F6"/></BarChart></ResponsiveContainer>
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
  const data = rows.map((player) => ({ ...player, name: firstName(player.name), fullName: player.name, span: Math.max(0, player.rank_p90 - player.rank_p10) })).sort((a, b) => a.rank - b.rank)
  if (!data.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} layout="vertical" margin={{ left: 4, right: 18, top: 8, bottom: 16 }}><CartesianGrid horizontal={false}/><XAxis type="number" domain={[1, 40]} tick={{ fontSize: 10 }}/><YAxis type="category" dataKey="name" width={82} tick={{ fontSize: 10 }}/><Tooltip contentStyle={tipStyle} labelFormatter={(_, payload) => { const p = payload?.[0]?.payload; return p ? `${p.fullName}: final rank ${p.rank}, 10th-90th percentile range ${p.rank_p10} to ${p.rank_p90}` : '' }}/><Bar dataKey="rank_p10" stackId="r" fill="transparent"/><Bar dataKey="span" stackId="r" fill="#F4A6CF" radius={6}/><Scatter data={data} dataKey="rank" fill="#E6007E"/></ComposedChart></ResponsiveContainer>
}

export function DataBars({ rows, metric }: { rows: any[]; metric: string }) {
  if (!rows.length) return <div className="empty-chart">No data</div>
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={rows.map((row) => ({ ...row, name: firstName(row.name), fullName: row.name }))} margin={{ left: 4, right: 14, top: 10, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={tipStyle} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}/><Bar dataKey={metric} fill="#e6007e" radius={[5, 5, 0, 0]}>{rows.map((row, index) => <Cell key={`${row.name}${index}`} fill={row[metric] >= 0 ? '#e6007e' : '#ed7070'}/>)}</Bar></BarChart></ResponsiveContainer>
}
