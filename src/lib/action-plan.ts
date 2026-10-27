import { supabase } from "@/integrations/supabase/client";

export type ActionPlanStep = {
  id: string;
  code: string;
  indicator: string;
  action: string;
  what: string;
  how: string;
  start: string;
  due: string;
  who: string;
  resources: string;
  risk: string;
  progress: string;
  notes: string;
  included: boolean;
};

export type ActionPlan = {
  id: string;
  assessment_id: string;
  area: string;
  indicators: string[];
  steps: ActionPlanStep[];
};

export const PROGRESS_OPTIONS = ["Not Started", "In Progress", "Completed", "On Hold"];

export function stepId(code: string, action: string) {
  return `${code}::${action}`;
}

export function makeStep(code: string, indicator: string, action: string): ActionPlanStep {
  return {
    id: stepId(code, action),
    code,
    indicator,
    action,
    what: action,
    how: "",
    start: "",
    due: "",
    who: "",
    resources: "",
    risk: "",
    progress: "Not Started",
    notes: "",
    included: true,
  };
}

export function indicatorCode(indicator: string) {
  return indicator.split(" ")[0] || indicator;
}

/** The indicator's wording, with the leading code removed (e.g. "1.4 Have a budget" -> "Have a budget"). */
export function indicatorName(indicator: string) {
  const code = indicatorCode(indicator);
  const name = indicator.slice(code.length).trim();
  return name || indicator;
}


function normalizeIndicators(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => String(v)).filter((v) => v);
}

function normalizeSteps(raw: unknown): ActionPlanStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
    .map((s) => ({
      id: String(s.id ?? ""),
      code: String(s.code ?? ""),
      indicator: String(s.indicator ?? ""),
      action: String(s.action ?? ""),
      what: String(s.what ?? s.action ?? ""),
      how: String(s.how ?? ""),
      start: String(s.start ?? ""),
      due: String(s.due ?? ""),
      who: String(s.who ?? ""),
      resources: String(s.resources ?? ""),
      risk: String(s.risk ?? ""),
      progress: String(s.progress ?? "Not Started"),
      notes: String(s.notes ?? ""),
      included: s.included !== false,
    }))
    .filter((s) => s.id);
}

export async function loadActionPlan(assessmentId: string): Promise<ActionPlan | null> {
  const { data } = await supabase
    .from("action_plans")
    .select("id, assessment_id, area, steps, indicators")
    .eq("assessment_id", assessmentId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    assessment_id: data.assessment_id,
    area: data.area as string,
    indicators: normalizeIndicators(data.indicators),
    steps: normalizeSteps(data.steps),
  };
}

export async function saveActionPlan(
  assessmentId: string,
  area: string,
  patch: { steps?: ActionPlanStep[]; indicators?: string[] }
) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return;

  const existing = await loadActionPlan(assessmentId);
  const payload = {
    user_id: uid,
    assessment_id: assessmentId,
    area: area as never,
    indicators: (patch.indicators ?? existing?.indicators ?? []) as never,
    steps: (patch.steps ?? existing?.steps ?? []) as never,
  };

  await supabase.from("action_plans").upsert(payload, { onConflict: "assessment_id" });
}
