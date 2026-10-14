export type AreaKey = "representativeness" | "governance" | "empowerment" | "results";

export type AreaDef = {
  key: AreaKey;
  badge: string;
  title: string;
  description: string;
  color: string;
  softBg: string;
  softText: string;
  panelBg: string;
};

export const AREAS: AreaDef[] = [
  {
    key: "representativeness",
    badge: "AREA 1",
    title: "Representativeness and Inclusion",
    description:
      "Who is part of the LYC, how representative it is of local youth, and how inclusive and accessible participation is for all.",
    color: "var(--impact-purple)",
    softBg: "#EDE4F6",
    softText: "var(--impact-purple)",
    panelBg: "#EDE4F6",
  },
  {
    key: "governance",
    badge: "AREA 2",
    title: "Governance and Transparency",
    description:
      "How the LYC is organised, how decisions are made, and how open and accountable it is to youth and the community.",
    color: "var(--impact-orange)",
    softBg: "#FDE6CE",
    softText: "#B85E10",
    panelBg: "#FDE6CE",
  },
  {
    key: "empowerment",
    badge: "AREA 3",
    title: "Empowerment and Resources",
    description:
      "The skills, support and resources available to members so they can act with confidence and continuity.",
    color: "var(--impact-pink)",
    softBg: "#FBD9E7",
    softText: "#B32565",
    panelBg: "#FBD9E7",
  },
  {
    key: "results",
    badge: "AREA 4",
    title: "Results and Impact",
    description:
      "What the LYC achieves, how it measures change, and the visible impact on young people and local policies.",
    color: "var(--impact-green)",
    softBg: "#D3EDEE",
    softText: "var(--impact-green)",
    panelBg: "#D3EDEE",
  },
];
