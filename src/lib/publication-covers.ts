import analysis from "@/assets/publication-covers/cover-6.asset.json";
import charterPortrait from "@/assets/publication-covers/charter-portrait.jpg";
import toolkit from "@/assets/publication-covers/cover-14.asset.json";
import mappingPortrait from "@/assets/publication-covers/mapping-portrait.jpg";
import realGuidelines from "@/assets/publication-covers/real-qualitative-guidelines.png.asset.json";
import realGoodPractices from "@/assets/publication-covers/real-good-practices.png.asset.json";
import realModels from "@/assets/publication-covers/real-models-mechanisms.png.asset.json";
import realToolbox from "@/assets/publication-covers/real-toolbox-democracy.png.asset.json";

const trimmedCovers: Record<string, string> = {
  "cover-good-practices.png": realGoodPractices.url,
  "cover-qualitative-guidelines.png": realGuidelines.url,
  "cover-3.png": analysis.url,
  "cover-models-mechanisms.png": realModels.url,
  "cover-image-5.png": charterPortrait,
  "cover-image-8.png": realToolbox.url,
  "cover-image-6.png": toolkit.url,
  "cover-7.png": mappingPortrait,
};

export function publicationCoverSource(source: string) {
  const filename = source.split("/").pop()?.split("?")[0];
  return (filename && trimmedCovers[filename]) || source;
}