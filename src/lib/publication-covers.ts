import realToolkitUpgrading from "@/assets/publication-covers/real-toolkit-upgrading.png.asset.json";
import realGuidelines from "@/assets/publication-covers/real-qualitative-guidelines.png.asset.json";
import realGoodPractices from "@/assets/publication-covers/real-good-practices.png.asset.json";
import realModels from "@/assets/publication-covers/real-models-mechanisms.png.asset.json";
import realToolbox from "@/assets/publication-covers/real-toolbox-democracy.png.asset.json";
import realMapping from "@/assets/publication-covers/real-mapping-practices.png.asset.json";
import realCharter from "@/assets/publication-covers/real-quality-charter.png.asset.json";
import realAnalysisPolicy from "@/assets/publication-covers/real-analysis-policy.png.asset.json";
import thumbCover1 from "@/assets/publication-covers/thumbs/cover-1-thumb.asset.json";
import thumbCover10 from "@/assets/publication-covers/thumbs/cover-10-thumb.asset.json";
import thumbCover2 from "@/assets/publication-covers/thumbs/cover-2-thumb.asset.json";
import thumbCover3 from "@/assets/publication-covers/thumbs/cover-3-thumb.asset.json";
import thumbCover4 from "@/assets/publication-covers/thumbs/cover-4-thumb.asset.json";
import thumbCover5 from "@/assets/publication-covers/thumbs/cover-5-thumb.asset.json";
import thumbCover6 from "@/assets/publication-covers/thumbs/cover-6-thumb.asset.json";
import thumbCover7 from "@/assets/publication-covers/thumbs/cover-7-thumb.asset.json";
import thumbCover8 from "@/assets/publication-covers/thumbs/cover-8-thumb.asset.json";
import thumbCover9 from "@/assets/publication-covers/thumbs/cover-9-thumb.asset.json";
import thumbCoverAddMeaningful from "@/assets/publication-covers/thumbs/cover-add-meaningful-thumb.asset.json";
import thumbCoverBuildingEffective from "@/assets/publication-covers/thumbs/cover-building-effective-thumb.asset.json";
import thumbCoverGlobalYouthGuide from "@/assets/publication-covers/thumbs/cover-global-youth-guide-thumb.asset.json";
import thumbCoverGoodPractices from "@/assets/publication-covers/thumbs/cover-good-practices-thumb.asset.json";
import thumbCoverImage5 from "@/assets/publication-covers/thumbs/cover-image-5-thumb.asset.json";
import thumbCoverImage6 from "@/assets/publication-covers/thumbs/cover-image-6-thumb.asset.json";
import thumbCoverImage7 from "@/assets/publication-covers/thumbs/cover-image-7-thumb.asset.json";
import thumbCoverImage8 from "@/assets/publication-covers/thumbs/cover-image-8-thumb.asset.json";
import thumbCoverModelsMechanisms from "@/assets/publication-covers/thumbs/cover-models-mechanisms-thumb.asset.json";
import thumbCoverQualitativeGuidelines from "@/assets/publication-covers/thumbs/cover-qualitative-guidelines-thumb.asset.json";
import thumbIdeathonCover from "@/assets/publication-covers/thumbs/ideathon-cover-thumb.asset.json";

const trimmedCovers: Record<string, string> = {
  "cover-good-practices.png": realGoodPractices.url,
  "cover-qualitative-guidelines.png": realGuidelines.url,
  "cover-3.png": realAnalysisPolicy.url,
  "cover-models-mechanisms.png": realModels.url,
  "cover-image-5.png": realCharter.url,
  "cover-image-8.png": realToolbox.url,
  "cover-image-6.png": realToolkitUpgrading.url,
  "cover-7.png": realMapping.url,
};

// Lightweight WebP versions of every cover (already trimmed-swapped where needed),
// used on cards so listing pages don't download full-resolution artwork.
const coverThumbs: Record<string, string> = {
  "cover-1.png": thumbCover1.url,
  "cover-10.png": thumbCover10.url,
  "cover-2.png": thumbCover2.url,
  "cover-2.jpg": thumbCover2.url,
  "cover-3.png": thumbCover3.url,
  "cover-4.png": thumbCover4.url,
  "cover-5.png": thumbCover5.url,
  "cover-6.png": thumbCover6.url,
  "cover-7.png": thumbCover7.url,
  "cover-8.png": thumbCover8.url,
  "cover-9.png": thumbCover9.url,
  "cover-add-meaningful.png": thumbCoverAddMeaningful.url,
  "cover-building-effective.png": thumbCoverBuildingEffective.url,
  "cover-global-youth-guide.png": thumbCoverGlobalYouthGuide.url,
  "cover-good-practices.png": thumbCoverGoodPractices.url,
  "cover-image-5.png": thumbCoverImage5.url,
  "cover-image-6.png": thumbCoverImage6.url,
  "cover-image-7.png": thumbCoverImage7.url,
  "cover-image-8.png": thumbCoverImage8.url,
  "cover-models-mechanisms.png": thumbCoverModelsMechanisms.url,
  "cover-qualitative-guidelines.png": thumbCoverQualitativeGuidelines.url,
  "ideathon-cover.png": thumbIdeathonCover.url,
};

const landscapeCovers = new Set([realMapping.url, realCharter.url]);
const landscapeFilenames = new Set(["cover-image-7.png"]);

function coverFilename(source: string) {
  return source.split("/").pop()?.split("?")[0];
}

export function publicationCoverSource(source: string) {
  const filename = coverFilename(source);
  return (filename && trimmedCovers[filename]) || source;
}

/** Small WebP variant for card listings; falls back to the full cover when unknown. */
export function publicationCoverThumb(source: string) {
  const filename = coverFilename(source);
  return (filename && coverThumbs[filename]) || publicationCoverSource(source);
}

/** True when the resolved cover artwork is landscape and should render as a horizontal book. */
export function publicationCoverIsLandscape(source: string) {
  const filename = coverFilename(source);
  if (filename && landscapeFilenames.has(filename)) return true;
  return landscapeCovers.has(publicationCoverSource(source));
}
