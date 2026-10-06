export function Globe({ large = false }: { large?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 240 240" className={large ? "globe globe-large" : "globe"} fill="none">
    <circle cx="120" cy="120" r="91" /><ellipse cx="120" cy="120" rx="43" ry="91" />
    <ellipse cx="120" cy="120" rx="76" ry="91" /><path d="M29 120h182M44 70h152M44 170h152M120 29v182" />
    <circle cx="168" cy="70" r="7" className="globe-dot" /><circle cx="81" cy="170" r="5" className="globe-dot" />
    <path d="M19 202h202M19 210h75" className="globe-rule" />
  </svg>;
}
export function Arrow() { return <span aria-hidden="true" className="external-arrow">↗</span>; }
