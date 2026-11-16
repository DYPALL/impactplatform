// A flat neutral block used when a photo cannot be fetched (for example while
// the asset service is briefly unreachable). Swapping the source keeps the
// image element "loaded", so the browser draws no broken-image glyph and the
// photo area simply reads as an empty placeholder.
export const FAILED_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='24' viewBox='0 0 32 24'%3E%3Crect width='32' height='24' fill='%23f1f3f9'/%3E%3C/svg%3E";

export function markFailedImage(img: HTMLImageElement) {
  if (img.dataset.imgFailed === "1") return;
  img.dataset.imgFailed = "1";
  img.src = FAILED_IMAGE_SRC;
}
