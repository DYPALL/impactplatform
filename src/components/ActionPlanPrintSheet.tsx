import { actionPlanExportPages } from "@/lib/action-plan-export";
import type { ActionPlanStep } from "@/lib/action-plan";
import impactLogo from "@/assets/logo_color_impact.png.asset.json";

export function ActionPlanPrintSheet({ areaName, steps }: { areaName: string; steps: ActionPlanStep[] }) {
  const pages = actionPlanExportPages(steps);
  return <div className="plan-print-sheet">
    {pages.map(page => <section key={page.id} className="plan-print-page">
      <div className="plan-print-head">
        <img src={impactLogo.url} alt="IMPACT" className="plan-print-logo" />
        <h1>Build your action plan</h1>
        <p className="plan-print-meta"><strong>Area of assessment:</strong> {areaName}</p>
        <p className="plan-print-indicator"><strong>Indicator:</strong> {page.indicator}</p>
      </div>
      <div className="plan-print-step-title"><span className="plan-print-num">{page.number}</span><div><strong>Action step</strong><p>{page.action}</p></div></div>
      <div className="plan-print-grid">
        {page.fields.map(([label, value]) => <div key={label} className="plan-print-field"><p>{label}</p><p className="plan-print-val">{value}</p><div className="plan-print-writing" aria-hidden="true" /></div>)}
      </div>
    </section>)}
  </div>;
}