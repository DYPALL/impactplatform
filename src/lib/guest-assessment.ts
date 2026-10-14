import { supabase } from "@/integrations/supabase/client";

const KEY = "impact_guest_assessment";

export type GuestAssessment = {
  area: string;
  step: number;
  completed: boolean;
  answers: unknown;
  percentages: number[];
};

export function loadGuest(area?: string): GuestAssessment | null {
  if (typeof window === "undefined") return null;
  try {
    const g = JSON.parse(localStorage.getItem(KEY) ?? "null") as GuestAssessment | null;
    if (!g || (area && g.area !== area)) return null;
    return g;
  } catch {
    return null;
  }
}

export function saveGuest(g: GuestAssessment) {
  localStorage.setItem(KEY, JSON.stringify(g));
}

let claiming: Promise<void> | null = null;

/** Moves a guest's assessment (stored in the browser) into the signed-in user's account. */
export function claimGuestAssessment(userId: string): Promise<void> {
  if (claiming) return claiming;
  const g = loadGuest();
  if (!g) return Promise.resolve();

  claiming = (async () => {
    const { error } = await supabase.from("assessments").insert({
      user_id: userId,
      area: g.area as "representativeness",
      status: g.completed ? "completed" : "in_progress",
      current_step: g.step,
      answers: g.answers as never,
      percentages: g.percentages,
      completed_at: g.completed ? new Date().toISOString() : null,
    });
    if (!error && localStorage.getItem(KEY) === JSON.stringify(g)) localStorage.removeItem(KEY);
  })().finally(() => {
    claiming = null;
  });
  return claiming;
}
