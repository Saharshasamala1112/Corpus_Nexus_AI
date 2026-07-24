interface RobotIconProps {
  size?: number
  className?: string
}

function RobotIcon({ size = 16, className }: RobotIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="4" width="14" height="12" rx="3" fill="currentColor" opacity="0.9" />
      <rect x="7.5" y="6.5" width="3.5" height="4" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="13" y="6.5" width="3.5" height="4" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="2" y="7" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="18.5" y="7" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="8.5" y="16" width="7" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="10" y="18" width="4" height="2.5" rx="1" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="2.5" r="1" fill="currentColor" opacity="0.5" />
      <line x1="12" y1="3.5" x2="12" y2="5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <rect x="10" y="12" width="1" height="1" rx="0.3" fill="currentColor" opacity="0.5" />
      <rect x="13" y="12" width="1" height="1" rx="0.3" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export default RobotIcon
