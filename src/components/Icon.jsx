export default function Icon({ name, className = '', style, filled }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", ...style }
          : style
      }
    >
      {name}
    </span>
  )
}
