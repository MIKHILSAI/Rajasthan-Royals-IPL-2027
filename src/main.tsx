import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Home, Hub } from './pages/Pages'
import { Profile, Leaderboard, Compare } from './pages/MorePages'
import { PressureModel, Reliability, Methodology, Limitations, Report } from './pages/Insights'
import './styles.css'
function App(){return <BrowserRouter><Routes><Route element={<Shell/>}><Route index element={<Home/>}/><Route path="batters" element={<Hub role="batters"/>}/><Route path="bowlers" element={<Hub role="bowlers"/>}/><Route path="batters/:pid" element={<Profile/>}/><Route path="bowlers/:pid" element={<Profile/>}/><Route path="leaderboard" element={<Leaderboard/>}/><Route path="compare" element={<Compare/>}/><Route path="pressure" element={<PressureModel/>}/><Route path="reliability" element={<Reliability/>}/><Route path="methodology" element={<Methodology/>}/><Route path="limitations" element={<Limitations/>}/><Route path="report" element={<Report/>}/><Route path="*" element={<Home/>}/></Route></Routes></BrowserRouter>}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
