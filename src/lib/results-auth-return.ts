import { AREA_ORDER } from "@/components/questionnaire/content";

const KEY = "impact_results_auth_return";
export function resultsReturnArea(value: unknown): string | undefined {
  return typeof value === "string" && AREA_ORDER.some((area) => area === value) ? value : undefined;
}
export function rememberResultsReturn(area: string) {
  const valid = resultsReturnArea(area);
  if (valid) localStorage.setItem(KEY, valid);
}
export function pendingResultsReturn(): string | undefined {
  return resultsReturnArea(localStorage.getItem(KEY));
}
export function clearResultsReturn() { localStorage.removeItem(KEY); }
export function matchesResultsReturn(area: string | undefined, result: { area: string; completed: boolean } | null): boolean {
  return Boolean(area && result?.completed && result.area === area);
}