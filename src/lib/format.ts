export const fmt=(v:unknown,d=1)=>v==null||typeof v!=='number'?'n/a':v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
export const pct=(v:unknown)=>v==null||typeof v!=='number'?'n/a':`${fmt(v*100,0)}%`
export const num=(v:unknown)=>v==null||typeof v!=='number'?'n/a':v.toLocaleString('en-US')
export const initials=(s:string)=>s.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
export const slug=(s:string)=>s.toLowerCase().replaceAll(' ','-')
