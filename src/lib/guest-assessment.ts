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

type ClaimedAssessment = { id: string; area: string; completed: boolean };
let claiming: Promise<ClaimedAssessment | null> | null = null;
const CLAIM_KEY = "impact_claimed_guest_assessment";

/** Moves a guest's assessment (stored in the browser) into the signed-in user's account. */
export function claimGuestAssessment(userId: string): Promise<ClaimedAssessment | null> {
  if (claiming) return claiming;
  const g = loadGuest();
  if (!g) {
    try {
      const previous = JSON.parse(localStorage.getItem(CLAIM_KEY) ?? "null");
      return Promise.resolve(previous?.userId === userId ? previous.result : null);
    } catch { return Promise.resolve(null); }
  }

  claiming = (async () => {
    const { data, error } = await supabase.from("assessments").insert({
      user_id: userId,
      area: g.area as "representativeness",
      status: g.completed ? "completed" : "in_progress",
      current_step: g.step,
      answers: g.answers as never,
      percentages: g.percentages,
      completed_at: g.completed ? new Date().toISOString() : null,
    }).select("id").single();
    if (error || !data) throw new Error("Your assessment could not be saved. Please try again.");
    const result = { id: data.id, area: g.area, completed: g.completed };
    localStorage.setItem(CLAIM_KEY, JSON.stringify({ userId, result }));
    if (localStorage.getItem(KEY) === JSON.stringify(g)) localStorage.removeItem(KEY);
    return result;
  })().finally(() => {
    claiming = null;
  });
  return claiming;
}
