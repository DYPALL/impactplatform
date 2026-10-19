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
    .select("id, assessment_id, area, steps")
    .eq("assessment_id", assessmentId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    assessment_id: data.assessment_id,
    area: data.area as string,
    steps: normalizeSteps(data.steps),
  };
}

export async function saveActionPlan(
  assessmentId: string,
  area: string,
  patch: { steps?: ActionPlanStep[] }
) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return;

  const existing = await loadActionPlan(assessmentId);
  const payload = {
    user_id: uid,
    assessment_id: assessmentId,
    area: area as never,
    steps: (patch.steps ?? existing?.steps ?? []) as never,
  };

  await supabase.from("action_plans").upsert(payload, { onConflict: "assessment_id" });
}
