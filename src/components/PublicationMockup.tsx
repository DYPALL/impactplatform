import { useState } from "react";
import { BookOpen } from "lucide-react";
import { publicationCoverSource, publicationCoverIsLandscape } from "@/lib/publication-covers";

/** Keeps publisher artwork intact while adding a presentational book binding. */
export function PublicationMockup({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const landscape = publicationCoverIsLandscape(src);

  return (
    <div className="publication-mockup-stage">
      {failed ? (
        <BookOpen className="h-12 w-12 text-primary" aria-label={title} />
      ) : (
        <div className={`publication-mockup-book${landscape ? " publication-mockup-book--landscape" : ""}`}>
          <img
            src={publicationCoverSource(src)}
            alt={title}
            loading="lazy"
            className={`publication-mockup-cover${landscape ? " publication-mockup-cover--landscape" : ""}`}
            onError={() => setFailed(true)}
          />
          <span className="publication-mockup-binding" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
