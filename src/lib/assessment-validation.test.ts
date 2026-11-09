/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { AREAS } from "../components/questionnaire/content";
import { firstUnansweredIndicator, isIndicatorAnswered, type MatrixState, type ScaleState } from "./assessment-validation";

describe("mandatory assessment answers", () => {
  for (const area of Object.values(AREAS)) {
    test(`${area.key}: every matrix criterion requires an explicit answer`, () => {
      area.indicators.forEach((indicator, index) => {
        if (indicator.type !== "matrix") return;
        const answers: MatrixState = { [index]: {} };
        indicator.criteria.forEach((_, row) => { answers[index][row] = "yes"; });
        expect(isIndicatorAnswered(indicator, index, answers, {})).toBe(true);
        indicator.criteria.forEach((_, row) => {
          delete answers[index][row];
          expect(isIndicatorAnswered(indicator, index, answers, {})).toBe(false);
          answers[index][row] = "na";
        });
      });
    });
    test(`${area.key}: sliders require a deliberate level selection, not defaults or skips`, () => {
      area.indicators.forEach((indicator, index) => {
        if (indicator.type !== "slider") return;
        expect(isIndicatorAnswered(indicator, index, {}, {})).toBe(false);
        expect(isIndicatorAnswered(indicator, index, {}, { [index]: { value: 0, touched: false, na: false } })).toBe(false);
        expect(isIndicatorAnswered(indicator, index, {}, { [index]: { value: 0, touched: true, na: true } })).toBe(false);
        expect(isIndicatorAnswered(indicator, index, {}, { [index]: { value: 0, touched: true, na: false } })).toBe(true);
      });
    });
    test(`${area.key}: submission requires every indicator, including earlier resumed questions`, () => {
      const matrix: MatrixState = {};
      const scale: ScaleState = {};
      area.indicators.forEach((indicator, index) => {
        if (indicator.type === "matrix") matrix[index] = Object.fromEntries(indicator.criteria.map((_, row) => [row, "no"]));
        else scale[index] = { value: 0, touched: true, na: false };
      });
      expect(firstUnansweredIndicator(area.indicators, matrix, scale)).toBe(-1);
      delete matrix[0];
      delete scale[0];
      expect(firstUnansweredIndicator(area.indicators, matrix, scale)).toBe(0);
    });
  }
});