import type { QIndicator } from "@/components/questionnaire/content";

export type Answer = "yes" | "no" | "na";
export type MatrixState = Record<number, Record<number, Answer>>;
export type ScaleState = Record<number, { value: number; na: boolean; touched: boolean }>;

export function isIndicatorAnswered(indicator: QIndicator, index: number, matrix: MatrixState, scale: ScaleState): boolean {
  if (indicator.type === "matrix") {
    return indicator.criteria.every((_, row) => ["yes", "no", "na"].includes(matrix[index]?.[row] ?? ""));
  }
  const answer = scale[index];
  return Boolean(answer?.touched && !answer.na && Number.isInteger(answer.value) && answer.value >= 0 && answer.value < indicator.levels.length);
}

export function firstUnansweredIndicator(indicators: QIndicator[], matrix: MatrixState, scale: ScaleState): number {
  return indicators.findIndex((indicator, index) => !isIndicatorAnswered(indicator, index, matrix, scale));
}