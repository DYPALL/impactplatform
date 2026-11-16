import type { ActionPlanStep } from "@/lib/action-plan";
import { actionPlanExportPages } from "@/lib/action-plan-export";
import { actionPlanFieldIconSvg } from "@/lib/action-plan-field-icons";
import impactLogo from "@/assets/logo_color_impact.png.asset.json";

const PURPLE: [number, number, number] = [80, 33, 129];
const INK: [number, number, number] = [30, 27, 45];
const BORDER: [number, number, number] = [210, 205, 220];
const HIGHLIGHT: [number, number, number] = [242, 236, 248];

async function loadPng(src: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const context = c.getContext("2d");
  if (!context) throw new Error("Unable to prepare the plan logo");
  context.drawImage(img, 0, 0);
  return { data: c.toDataURL("image/png"), ratio: img.naturalHeight / img.naturalWidth };
}

/** Builds the saved plan as a downloadable A4 PDF, one action step per page. */
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export async function downloadActionPlanPdf(
  areaName: string,
  assessmentName: string,
  steps: ActionPlanStep[],
  accentHex = "#502181",
  blank = false,
) {
  const { jsPDF, AcroFormTextField } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadPng(impactLogo.url).catch(() => null);
  const pages = actionPlanExportPages(steps);
  const fieldIcons = new Map<string, string>();
  for (const [label] of pages[0]?.fields ?? []) {
    const svg = actionPlanFieldIconSvg(label, accentHex);
    if (svg) {
      const image = await loadPng(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      fieldIcons.set(label, image.data);
    }
  }
  const W = 210, M = 16, inner = W - M * 2;
  const writeIn = (name: string, x: number, y: number, width: number, height: number, multiline = false) => {
    const field = new AcroFormTextField();
    field.fieldName = name;
    field.x = x;
    field.y = y;
    field.width = width;
    field.height = height;
    field.multiline = multiline;
    field.fontSize = 11;
    field.maxFontSize = 11;
    doc.addField(field);
  };
  const coverValue = (name: string, value: string, y: number) => {
    if (blank) {
      doc.setDrawColor(...BORDER).setLineWidth(0.3).line(M + 8, y + 2, W - M - 8, y + 2);
      writeIn(name, M + 8, y - 6, inner - 16, 8);
    } else doc.text(doc.splitTextToSize(value, inner - 16).slice(0, 1), M + 8, y);
  };

  // Colourful cover: area colour, brand triangles, logo, area and assessment name.
  const accent = hex(accentHex);
  doc.setFillColor(...accent).rect(0, 0, 210, 297, "F");
  const tri = (c: string, pts: number[]) => {
    doc.setFillColor(...hex(c));
    doc.triangle(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5], "F");
  };
  tri("#F4A261", [150, 0, 210, 0, 210, 70]);
  tri("#E94B8A", [175, 40, 210, 95, 160, 110]);
  tri("#219C9E", [0, 230, 55, 297, 0, 297]);
  tri("#F4A261", [40, 255, 90, 297, 20, 297]);
  tri(accentHex === "#502181" ? "#E94B8A" : "#502181", [170, 230, 210, 205, 210, 265]);
  if (logo) {
    doc.setFillColor(255, 255, 255).roundedRect(M, 22, 58, 12 + 46 * logo.ratio, 4, 4, "F");
    doc.addImage(logo.data, "PNG", M + 6, 28, 46, 46 * logo.ratio);
  }
  doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(38);
  doc.text(["Build your", "action plan"], M, 120);
  doc.setFillColor(255, 255, 255).roundedRect(M, 150, inner, 62, 4, 4, "F");
  doc.setTextColor(...accent).setFontSize(10).text("AREA OF ASSESSMENT", M + 8, 162);
  doc.setTextColor(...INK).setFontSize(17);
  coverValue("cover_area", areaName, 171);
  doc.setTextColor(...accent).setFontSize(10).text("ASSESSMENT", M + 8, 192);
  doc.setTextColor(...INK).setFontSize(17);
  coverValue("cover_assessment", assessmentName, 201);

  pages.forEach((page) => {
    doc.addPage();
    let y = M;
    if (logo) { doc.addImage(logo.data, "PNG", M, y, 27, 27 * logo.ratio); y += 27 * logo.ratio + 5; }
    y += 3;
    doc.setFillColor(...HIGHLIGHT).roundedRect(M, y, inner, 19, 2, 2, "F");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...PURPLE);
    doc.text("AREA OF ASSESSMENT", M + 5, y + 6);
    doc.setFontSize(13);
    if (blank) {
      doc.setDrawColor(...BORDER).line(M + 5, y + 15, W - M - 5, y + 15);
      writeIn(`area_${page.number}`, M + 5, y + 7, inner - 10, 8);
    } else doc.text(areaName, M + 5, y + 13);
    y += 26;
    doc.setFontSize(10);
    const meta = (label: string, value: string) => {
      doc.setFont("helvetica", "bold").text(label, M, y);
      const lw = doc.getTextWidth(label) + 2;
      const lines = doc.setFont("helvetica", "normal").splitTextToSize(value || "", inner - lw);
      if (blank) {
        doc.setDrawColor(...BORDER).line(M + lw, y + 1, W - M, y + 1);
        writeIn(`${label}_${page.number}`, M + lw, y - 5, inner - lw, 6);
      } else doc.text(lines, M + lw, y);
      y += 5 * Math.max(1, lines.length);
    };
    meta("Assessment:", assessmentName);
    meta("Indicator:", page.indicator ?? "");
    y += 3;
    const act = doc.setFont("helvetica", "bold").setFontSize(11).splitTextToSize(page.action ?? "", inner - 25);
    const actionHeight = blank ? 27 : 16 + 5 * act.length;
    doc.setFillColor(...PURPLE).roundedRect(M, y, inner, actionHeight, 2, 2, "F");
    doc.setFillColor(255, 255, 255).circle(M + 8, y + 9, 4.5, "F");
    if (blank) writeIn(`step_number_${page.number}`, M + 5, y + 6, 6, 6);
    else doc.setTextColor(...PURPLE).setFontSize(10).text(String(page.number), M + 8, y + 10.2, { align: "center" });
    doc.setTextColor(255, 255, 255).setFontSize(9).text("ACTION STEP", M + 17, y + 7);
    if (blank) {
      doc.setFillColor(255, 255, 255).roundedRect(M + 17, y + 10, inner - 22, 12, 1, 1, "F");
      doc.setDrawColor(...BORDER).line(M + 20, y + 20, W - M - 8, y + 20);
      writeIn(`action_${page.number}`, M + 20, y + 11, inner - 28, 9);
    } else doc.setFontSize(11).text(act, M + 17, y + 14);
    y += actionHeight + 7;

    const gap = 5, colW = (inner - gap) / 2;
    const fields = blank ? page.fields.filter(([label]) => label !== "Progress tracking") : page.fields;
    const rows = Math.ceil(fields.length / 2);
    const boxH = Math.min(52, (297 - M - y - gap * (rows - 1)) / rows);
    fields.forEach(([label, value], f) => {
      const x = M + (f % 2) * (colW + gap), by = y + Math.floor(f / 2) * (boxH + gap);
      doc.setDrawColor(...BORDER).setLineWidth(0.3);
      doc.setFillColor(255, 255, 255).roundedRect(x, by, colW, boxH, 1.5, 1.5, "FD");
      doc.setDrawColor(...BORDER).setLineWidth(0.3);
      const icon = fieldIcons.get(label);
      if (icon) doc.addImage(icon, "PNG", x + 4, by + 2.5, 4.5, 4.5);
      doc.setTextColor(...PURPLE).setFont("helvetica", "bold").setFontSize(9).text(label, x + (icon ? 10 : 4), by + 6);
      doc.setTextColor(...INK).setFont("helvetica", "normal").setFontSize(9.5);
      const lines = doc.splitTextToSize(String(value ?? ""), colW - 8).slice(0, Math.floor((boxH - 12) / 4.4));
      doc.text(lines, x + 4, by + 12);
      let ly = by + 12 + lines.length * 4.4 + 4;
      for (; ly < by + boxH - 3; ly += 7) doc.line(x + 4, ly, x + colW - 4, ly);
      if (blank) writeIn(`field_${page.number}_${f}`, x + 4, by + 8, colW - 8, boxH - 12, true);
    });
  });

  const name = blank ? "IMPACT-blank-action-plan.pdf" : `IMPACT-action-plan-${`${areaName} ${assessmentName}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
  doc.save(name);
}

/** Regenerate the static catalogue template using the same layout as saved plans. */
export async function downloadBlankActionPlanPdf() {
  const steps: ActionPlanStep[] = Array.from({ length: 6 }, (_, i) => ({ id: `blank-${i}`, code: "", indicator: "", action: "", what: "", how: "", start: "", due: "", who: "", resources: "", risk: "", progress: "", notes: "", included: true }));
  await downloadActionPlanPdf("", "", steps, "#502181", true);
}
