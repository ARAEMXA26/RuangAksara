export default function RALogo({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 76 V28 H46 C56 28 60 36 56 46 C52 56 44 54 36 54 H24" />
      <path d="M40 54 L52 76" />
      <path d="M52 76 L72 28 L92 76" />
      <path d="M60 60 H84" />
      <path d="M30 76 Q58 50 86 76" />
    </svg>
  );
}
