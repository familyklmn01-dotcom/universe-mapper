export default function UniverseLogo({className='',title='Universe Mapper'}){
  return <svg className={`universe-logo ${className}`} viewBox="0 0 180 120" role="img" aria-label={title}>
    <defs>
      <radialGradient id="um-core" cx="35%" cy="28%" r="75%"><stop offset="0" stopColor="#b9c8ff"/><stop offset=".38" stopColor="#7896ff"/><stop offset="1" stopColor="#4b63d6"/></radialGradient>
      <radialGradient id="um-blue" cx="35%" cy="30%"><stop stopColor="#a9bdff"/><stop offset="1" stopColor="#5274e8"/></radialGradient>
      <radialGradient id="um-green" cx="35%" cy="30%"><stop stopColor="#a3f4d8"/><stop offset="1" stopColor="#43bd92"/></radialGradient>
      <radialGradient id="um-gold" cx="35%" cy="30%"><stop stopColor="#ffe6a0"/><stop offset="1" stopColor="#dda538"/></radialGradient>
      <linearGradient id="um-orbit" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8ba3ff" stopOpacity=".18"/><stop offset=".45" stopColor="#6687fa" stopOpacity=".72"/><stop offset="1" stopColor="#a6b7ff" stopOpacity=".12"/></linearGradient>
      <filter id="um-depth" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#050814" floodOpacity=".65"/><feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#8ca6ff" floodOpacity=".25"/></filter>
      <filter id="um-dot-depth" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#02040b" floodOpacity=".7"/></filter>
    </defs>
    <ellipse cx="90" cy="60" rx="73" ry="31" fill="none" stroke="url(#um-orbit)" strokeWidth="1.4" transform="rotate(-19 90 60)"/>
    <ellipse cx="90" cy="60" rx="57" ry="43" fill="none" stroke="url(#um-orbit)" strokeWidth="1.15" transform="rotate(25 90 60)"/>
    <ellipse cx="90" cy="60" rx="77" ry="20" fill="none" stroke="url(#um-orbit)" strokeWidth=".8" strokeDasharray="2 4" transform="rotate(8 90 60)" opacity=".55"/>
    <circle cx="90" cy="60" r="24" fill="url(#um-core)" filter="url(#um-depth)"/>
    <circle cx="84" cy="53" r="7" fill="#fff" opacity=".1"/>
    <text x="90" y="68" textAnchor="middle" fill="#fff" fontSize="25" fontFamily="Inter,Segoe UI,sans-serif" fontWeight="800">U</text>
    <circle cx="22" cy="43" r="6" fill="url(#um-blue)" filter="url(#um-dot-depth)"/>
    <circle cx="158" cy="50" r="5" fill="url(#um-green)" filter="url(#um-dot-depth)"/>
    <circle cx="106" cy="106" r="4.5" fill="url(#um-gold)" filter="url(#um-dot-depth)"/>
  </svg>
}
