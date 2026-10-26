export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t, i) => (
    <span key={i} className="marquee-item">
      {t} <span className="marquee-star">✳</span>
    </span>
  ));
  return (
    <div className="marquee" role="marquee" aria-label={items.join(", ")}>
      <div className="marquee-track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
