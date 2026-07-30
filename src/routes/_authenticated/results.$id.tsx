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
        <div className="mx-auto grid h-[60px] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 md:h-[72px] md:px-6 lg:px-10">
          <Link
            to="/dashboard"
            className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-white transition hover:opacity-80 md:gap-3 md:text-[15px]"
          >
            <ArrowLeft size={20} className="shrink-0" />
            <span className="truncate">
              <span className="md:hidden">Dashboard</span>
              <span className="hidden md:inline">Back to Dashboard</span>
            </span>
          </Link>
          <span className="shrink-0 text-[12px] text-white/85 md:text-[13px]">Saved results</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 pb-32 pt-6 md:px-5 md:pt-10 lg:px-10 lg:pb-20">
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
