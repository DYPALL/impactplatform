import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { actionPlanExportPages } from "./action-plan-export";
import type { ActionPlanStep } from "./action-plan";

const step: ActionPlanStep = { id: "a", code: "1.4", indicator: "1.4 Legitimacy", action: "Consult young people", what: "Run a youth meeting", how: "Invite schools", start: "2026-11-10", due: "2026-12-10", who: "Council members", resources: "Meeting room", risk: "Low attendance", progress: "In Progress", notes: "Invite youth clubs", included: true };
describe("Action Plan export", () => {
  it("creates one page per included action step, excluding unticked steps", () => {
    const pages = actionPlanExportPages([step, { ...step, id: "b" }, { ...step, id: "c", included: false }]);
    assert.equal(pages.length, 2);
    assert.deepEqual(pages.map(p => p.number), [1, 2]);
  });
  it("prefills the selected indicator, action and all online fields", () => {
    const [page] = actionPlanExportPages([step]);
    assert.equal(page.indicator, "1.4 Legitimacy");
    assert.equal(page.action, "Consult young people");
    assert.deepEqual(page.fields.map(([, value]) => value), ["Run a youth meeting", "Invite schools", "2026-11-10 / 2026-12-10", "Council members", "Meeting room", "Low attendance", "In Progress", "Invite youth clubs"]);
  });
});