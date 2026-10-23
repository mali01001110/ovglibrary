interface RatingStarsProps {
  rating?: number | null;
  ratingTop?: number | null;
  ratingsCount?: number | null;
  showCount?: boolean;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

export function RatingStars({
  rating,
  ratingTop,
  ratingsCount,
  showCount = false,
}: RatingStarsProps) {
  if (!rating || !ratingTop) {
    return null;
  }

  const clamped = Math.min(Math.max(rating, 0), ratingTop);
  const maxStars = Math.max(1, Math.round(ratingTop));
  const filled = Math.round(clamped);

  const stars = Array.from({ length: maxStars }, (_, i) => (
    <span key={i} aria-hidden="true" className={i < filled ? "" : "opacity-30"}>
      ★
    </span>
  ));

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs"
      title={`${rating.toFixed(2)} / ${ratingTop}`}
      aria-label={`Rated ${rating.toFixed(1)} out of ${ratingTop}`}
    >
      <span className="inline-flex items-center leading-none text-foreground">
        {stars}
      </span>
      <span className="text-muted-foreground">
        {rating.toFixed(1)}
        {showCount && ratingsCount != null ? (
          <span className="ml-1">({formatCount(ratingsCount)})</span>
        ) : null}
      </span>
    </span>
  );
}
