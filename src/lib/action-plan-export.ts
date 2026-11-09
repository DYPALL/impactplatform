import type { ActionPlanStep } from "@/lib/action-plan";

/** Each included action step becomes exactly one print page. */
export function actionPlanExportPages(steps: ActionPlanStep[]) {
  return steps.filter((step) => step.included).map((step, index) => ({
    number: index + 1,
    indicator: step.indicator,
    action: step.action,
    fields: [
      ["What?", step.what],
      ["How?", step.how],
      ["When? (begin / due)", [step.start, step.due].filter(Boolean).join(" / ")],
      ["Who?", step.who],
      ["Resources needed", step.resources],
      ["Potential risk", step.risk],
      ["Progress tracking", step.progress],
      ["Notes", step.notes],
    ],
    id: step.id,
  }));
}