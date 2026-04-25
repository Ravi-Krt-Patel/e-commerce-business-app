function Star({ variant }) {
  const fill = variant === 'full' ? 'currentColor' : 'none'
  const halfId = `half-${Math.random().toString(16).slice(2)}`

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`star-svg ${variant}`}
    >
      {variant === 'half' ? (
        <>
          <defs>
            <linearGradient id={halfId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={`url(#${halfId})`}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={fill}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export default function StarRating({ rating, max = 5, showValue = true, className = '' }) {
  const safeRating = Number.isFinite(rating) ? rating : 0
  const rounded = Math.round(safeRating * 2) / 2
  const fullCount = Math.floor(rounded)
  const halfCount = rounded - fullCount === 0.5 ? 1 : 0
  const emptyCount = Math.max(0, max - fullCount - halfCount)

  return (
    <div className={`product-rating ${className}`.trim()} aria-label={`Rated ${safeRating} out of ${max}`}>
      <span className="rating-stars" aria-hidden="true">
        {Array.from({ length: fullCount }).map((_, idx) => (
          <Star key={`f-${idx}`} variant="full" />
        ))}
        {halfCount === 1 ? <Star key="h" variant="half" /> : null}
        {Array.from({ length: emptyCount }).map((_, idx) => (
          <Star key={`e-${idx}`} variant="empty" />
        ))}
      </span>
      {showValue ? <span className="rating-text">{safeRating}{max === 5 ? ' / 5' : ''}</span> : null}
    </div>
  )
}

