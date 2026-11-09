import type { ActionPlanStep } from "@/lib/action-plan";
import { actionPlanExportPages } from "@/lib/action-plan-export";
import impactLogo from "@/assets/logo_color_impact.png.asset.json";

const PURPLE: [number, number, number] = [80, 33, 129];
const INK: [number, number, number] = [30, 27, 45];
const BORDER: [number, number, number] = [210, 205, 220];

async function loadPng(src: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  c.getContext("2d")!.drawImage(img, 0, 0);
  return { data: c.toDataURL("image/png"), ratio: img.naturalHeight / img.naturalWidth };
}

/** Builds the saved plan as a downloadable A4 PDF, one action step per page. */
export async function downloadActionPlanPdf(areaName: string, steps: ActionPlanStep[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadPng(impactLogo.url).catch(() => null);
  const pages = actionPlanExportPages(steps);
  const W = 210, M = 16, inner = W - M * 2;

  pages.forEach((page, i) => {
    if (i > 0) doc.addPage();
    let y = M;
    if (logo) { doc.addImage(logo.data, "PNG", M, y, 27, 27 * logo.ratio); y += 27 * logo.ratio + 5; }
    doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...INK);
    doc.text("Build your action plan", M, y + 5); y += 11;
    doc.setFontSize(10);
    const meta = (label: string, value: string) => {
      doc.setFont("helvetica", "bold").text(label, M, y);
      const lw = doc.getTextWidth(label) + 2;
      const lines = doc.setFont("helvetica", "normal").splitTextToSize(value || "", inner - lw);
      doc.text(lines, M + lw, y); y += 5 * Math.max(1, lines.length);
    };
    meta("Area of assessment:", areaName);
    meta("Indicator:", page.indicator ?? "");
    doc.setDrawColor(...PURPLE).setLineWidth(0.6).line(M, y, W - M, y); y += 8;

    doc.setLineWidth(0.3).circle(M + 4, y - 1, 4.2);
    doc.setTextColor(...PURPLE).setFontSize(10).text(String(page.number), M + 4, y + 0.5, { align: "center" });
    doc.setTextColor(...INK).setFont("helvetica", "bold").text("Action step", M + 12, y - 1);
    const act = doc.setFont("helvetica", "normal").splitTextToSize(page.action ?? "", inner - 12);
    doc.text(act, M + 12, y + 4); y += 6 + 4.5 * act.length + 2;

    const gap = 5, colW = (inner - gap) / 2;
    const rows = Math.ceil(page.fields.length / 2);
    const boxH = Math.min(52, (297 - M - y - gap * (rows - 1)) / rows);
    page.fields.forEach(([label, value], f) => {
      const x = M + (f % 2) * (colW + gap), by = y + Math.floor(f / 2) * (boxH + gap);
      doc.setDrawColor(...BORDER).setLineWidth(0.3).roundedRect(x, by, colW, boxH, 1.5, 1.5);
      doc.setTextColor(...PURPLE).setFont("helvetica", "bold").setFontSize(9).text(label, x + 4, by + 6);
      doc.setTextColor(...INK).setFont("helvetica", "normal").setFontSize(9.5);
      const lines = doc.splitTextToSize(String(value ?? ""), colW - 8).slice(0, Math.floor((boxH - 12) / 4.4));
      doc.text(lines, x + 4, by + 12);
      let ly = by + 12 + lines.length * 4.4 + 4;
      for (; ly < by + boxH - 3; ly += 7) doc.line(x + 4, ly, x + colW - 4, ly);
    });
  });

  const name = `IMPACT-action-plan-${areaName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
  doc.save(name);
}
