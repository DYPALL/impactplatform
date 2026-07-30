import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ResultsStep } from "@/components/questionnaire/ResultsStep";

export const Route = createFileRoute("/_authenticated/results/$id")({
  head: () => ({
    meta: [
      { title: "Assessment results — IMPACT" },
      { name: "description", content: "Review the results of a completed IMPACT self-assessment for your Local Youth Council." },
      { property: "og:title", content: "Assessment results — IMPACT" },
      { property: "og:description", content: "Review the results of a completed IMPACT self-assessment for your Local Youth Council." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedResultsPage,
});

const PURPLE = "#502181";

function SavedResultsPage() {
  const { id } = Route.useParams();
  const [percentages, setPercentages] = useState<number[] | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("assessments")
      .select("percentages, completed_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (!data) {
          setMissing(true);
          return;
        }
        setPercentages((data.percentages as number[]) ?? []);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <header className="sticky top-0 z-40" style={{ backgroundColor: PURPLE }}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-6 lg:px-10">
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-3 text-[15px] font-semibold text-white transition hover:opacity-80"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="ml-auto text-[13px] text-white/85">Saved results</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-20 pt-10 lg:px-10">
        {missing && (
          <p className="rounded-2xl bg-white p-6 text-[14px] text-[#6b7280] ring-1 ring-black/5">
            This assessment could not be found.
          </p>
        )}
        {percentages && <ResultsStep percentages={percentages} />}
      </main>
    </div>
  );
}
