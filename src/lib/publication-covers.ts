import goodPractices from "@/assets/publication-covers/cover-2.asset.json";
import guidelines from "@/assets/publication-covers/cover-3.asset.json";
import analysis from "@/assets/publication-covers/cover-6.asset.json";
import models from "@/assets/publication-covers/cover-7.asset.json";
import charter from "@/assets/publication-covers/cover-9.asset.json";
import toolbox from "@/assets/publication-covers/cover-13.asset.json";
import toolkit from "@/assets/publication-covers/cover-14.asset.json";
import mapping from "@/assets/publication-covers/cover-16.asset.json";

const trimmedCovers: Record<string, string> = {
  "cover-good-practices.png": goodPractices.url,
  "cover-qualitative-guidelines.png": guidelines.url,
  "cover-3.png": analysis.url,
  "cover-models-mechanisms.png": models.url,
  "cover-image-5.png": charter.url,
  "cover-image-8.png": toolbox.url,
  "cover-image-6.png": toolkit.url,
  "cover-7.png": mapping.url,
};

export function publicationCoverSource(source: string) {
  const filename = source.split("/").pop()?.split("?")[0];
  return (filename && trimmedCovers[filename]) || source;
}