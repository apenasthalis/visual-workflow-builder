interface WorkflowConnectionProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function WorkflowConnection({ from, to }: WorkflowConnectionProps) {
  const midX = (from.x + to.x) / 2
  const controlPoint1X = from.x + (midX - from.x) * 0.8
  const controlPoint2X = to.x - (to.x - midX) * 0.8

  const path = `
    M ${from.x} ${from.y}
    C ${controlPoint1X} ${from.y},
      ${controlPoint2X} ${to.y},
      ${to.x} ${to.y}
  `

  return (
    <g>
      <path d={path} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" className="pointer-events-none" />
      <path d={path} fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" className="pointer-events-none" />
      <circle cx={to.x} cy={to.y} r="4" fill="rgba(255, 255, 255, 0.5)" />
    </g>
  )
}
