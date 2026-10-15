import { useState } from "react";
import { BookOpen } from "lucide-react";

/** Keeps publisher artwork intact while adding a presentational book binding. */
export function PublicationMockup({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="publication-mockup-stage">
      {failed ? (
        <BookOpen className="h-12 w-12 text-primary" aria-label={title} />
      ) : (
        <div className="publication-mockup-book">
          <img src={src} alt={title} loading="lazy" className="publication-mockup-cover" onError={() => setFailed(true)} />
          <span className="publication-mockup-binding" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}