import toolkit from "@/assets/publication-covers/cover-14.asset.json";
import realGuidelines from "@/assets/publication-covers/real-qualitative-guidelines.png.asset.json";
import realGoodPractices from "@/assets/publication-covers/real-good-practices.png.asset.json";
import realModels from "@/assets/publication-covers/real-models-mechanisms.png.asset.json";
import realToolbox from "@/assets/publication-covers/real-toolbox-democracy.png.asset.json";
import realMapping from "@/assets/publication-covers/real-mapping-practices.png.asset.json";
import realCharter from "@/assets/publication-covers/real-quality-charter.png.asset.json";
import realAnalysisPolicy from "@/assets/publication-covers/real-analysis-policy.png.asset.json";

const trimmedCovers: Record<string, string> = {
  "cover-good-practices.png": realGoodPractices.url,
  "cover-qualitative-guidelines.png": realGuidelines.url,
  "cover-3.png": realAnalysisPolicy.url,
  "cover-models-mechanisms.png": realModels.url,
  "cover-image-5.png": realCharter.url,
  "cover-image-8.png": realToolbox.url,
  "cover-image-6.png": toolkit.url,
  "cover-7.png": realMapping.url,
};

const landscapeCovers = new Set([realMapping.url, realCharter.url]);
const landscapeFilenames = new Set(["cover-image-7.png"]);

export function publicationCoverSource(source: string) {
  const filename = source.split("/").pop()?.split("?")[0];
  return (filename && trimmedCovers[filename]) || source;
}

/** True when the resolved cover artwork is landscape and should render as a horizontal book. */
export function publicationCoverIsLandscape(source: string) {
  const filename = source.split("/").pop()?.split("?")[0];
  if (filename && landscapeFilenames.has(filename)) return true;
  return landscapeCovers.has(publicationCoverSource(source));
}
