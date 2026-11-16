const fieldArtwork: Record<string, string> = {
  "What?": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  "How?": '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="19" r="2" fill="currentColor"/>',
  "When?": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
  "Who?": '<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
  "Resources needed": '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',
  "Potential risk": '<path d="m12 3 10 18H2L12 3ZM12 9v5M12 17h.01"/>',
  "Progress tracking": '<path d="M4 3v18h17M8 16l4-5 4 2 5-7"/>',
  "Notes": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M8 12h8M8 16h6"/>',
};

function artworkForLabel(label: string) {
  return fieldArtwork[label.startsWith("When?") ? "When?" : label];
}

/** Shared artwork keeps online, printed and downloaded field icons identical. */
export function ActionPlanFieldIcon({ label, className }: { label: string; className?: string }) {
  const artwork = artworkForLabel(label);
  if (!artwork) return null;
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{ __html: artwork }} />;
}

export function actionPlanFieldIconSvg(label: string, color: string) {
  const artwork = artworkForLabel(label);
  if (!artwork) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" color="${color}" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${artwork}</svg>`;
}