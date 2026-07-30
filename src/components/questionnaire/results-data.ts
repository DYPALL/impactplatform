export type LevelKey = 0 | 1 | 2 | 3;

export const LEVELS = [
  { label: "Not at all", color: "#E14B45", soft: "#FDECEB" },
  { label: "Partially", color: "#E8913C", soft: "#FDF1E5" },
  { label: "Mostly", color: "#E5C13F", soft: "#FCF7E4" },
  { label: "Fully", color: "#33A06A", soft: "#E9F6EF" },
] as const;

export function levelFromPct(pct: number): LevelKey {
  if (pct >= 75) return 3;
  if (pct >= 50) return 2;
  if (pct >= 25) return 1;
  return 0;
}

export type IndicatorContent = {
  code: string;
  title: string;
  question: string;
  about: string;
  feedback: Record<LevelKey, string>;
  reflection: string[];
  actions: string[];
};

export const INDICATOR_CONTENT: IndicatorContent[] = [
  {
    code: "1.1",
    title: "Diversity of Membership",
    question: "Does your LYC reflect the demographic composition of the local youth population?",
    about:
      "The LYC strives to reflect the demographic composition of the local youth population by including members representing a diverse LYC: it brings together young people of different ages, genders, cultural and ethnic backgrounds, socioeconomic conditions, abilities, and geographical areas. Particular attention is given to reaching young people from underrepresented groups.",
    feedback: {
      0: "Your LYC currently reflects only a narrow part of the local youth population. Mapping who is missing is the fastest way to unlock progress.",
      1: "Some groups of young people are represented, but several parts of the local youth population are still absent from your council.",
      2: "Your LYC represents most groups of local youth. A focused effort on the remaining gaps will consolidate your legitimacy.",
      3: "Your LYC reflects the diversity of local youth, showing that inclusive recruitment and engagement mechanisms are in place. This gives your council a strong foundation for credibility and influence. Keep this momentum going and continue to welcome new voices.",
    },
    reflection: [
      "Which groups of young people in your municipality are least present in your council today, and why?",
      "What does your current recruitment process unintentionally make harder for some young people?",
      "Who could help you reach the young people you are not reaching now?",
    ],
    actions: [
      "Map the local youth population, considering age, gender, cultural background, socioeconomic situation, geography, abilities, and life situations.",
      "Identify which types of young people are underrepresented or missing from your LYC.",
      "Connect with schools, community services, and local actors who work with underrepresented young people to reach missing voices.",
      "Use inclusive and open recruitment approaches that allow diverse young people to join the LYC.",
      "Ensure recruitment messages and materials are inclusive, clear, and accessible to all young people.",
      "Create a welcoming and safe environment where diverse members feel respected and able to participate.",
      "Explore flexible participation options (e.g. observers, temporary participation, mentoring) to lower entry barriers for underrepresented youth.",
      "Encourage current members to act as ambassadors and reach out to peers from different backgrounds and life situations.",
      "Regularly review the diversity of LYC membership and adapt outreach and recruitment efforts when gaps appear.",
    ],
  },
  {
    code: "1.2",
    title: "Representation of youth groups and interests",
    question: "Does your LYC reflect the range of youth groups and interests present in your community?",
    about:
      "The LYC brings together representatives from diverse youth organizations, movements, and communities of interest, ensuring that different forms of youth participation are present as well as different thematic areas. These can include NGOs, student councils, informal collectives, arts, sports, environmental groups, faith-based organizations, and independent voices.",
    feedback: {
      0: "While some youth represent themselves, key subgroups are not represented or consulted. Expanding outreach strategies will make your council more representative of all youth interests.",
      1: "A few types of youth groups are present, but whole parts of the local youth ecosystem are still outside your council.",
      2: "Most youth groups and thematic interests are represented. Reaching the remaining informal or grassroots groups is your next step.",
      3: "Your LYC connects with the full range of youth organizations, movements, and interests in your community.",
    },
    reflection: [
      "Which youth organizations or movements in your community have never been in contact with your LYC?",
      "Are informal and grassroots groups treated as equal partners to formal organizations?",
      "Which thematic causes matter to local youth but are absent from your agenda?",
    ],
    actions: [
      "Map all youth organizations, movements, and informal groups active in your municipality.",
      "Invite groups that are currently unrepresented to observe or contribute to a session.",
      "Create a lightweight partnership format for informal and grassroots collectives.",
      "Rotate agenda topics so different thematic interests are covered across the year.",
      "Review annually whether new youth movements have emerged locally.",
    ],
  },
  {
    code: "1.3",
    title: "Outreach and Consultation",
    question: "To what extent does your LYC engage and consult young people beyond its membership?",
    about:
      "The LYC actively engages young people beyond its membership by seeking input, perspectives, and feedback from a wider group of young people. Effective outreach involves understanding which groups are not currently engaged and creating opportunities for them to contribute.",
    feedback: {
      0: "There is no systematic outreach beyond your membership yet. Even one recurring consultation channel would change this significantly.",
      1: "Outreach activities occur occasionally but lack systemic coverage. Implementing regular digital surveys or physical feedback nodes can substantially bolster off-membership youth representation.",
      2: "Consultation happens regularly, but some groups remain less involved or feedback is not consistently used.",
      3: "A broad range of young people are regularly consulted and their input informs your priorities, decisions, and activities.",
    },
    reflection: [
      "How does a young person who is not a member share an opinion with your LYC today?",
      "When did you last change a decision because of input from non-members?",
      "Which consultation formats would fit the young people you struggle to reach?",
    ],
    actions: [
      "Set up at least one permanent channel for non-members to share views.",
      "Run a short consultation before each major decision or annual plan.",
      "Go to where young people already are (schools, clubs, online spaces) instead of waiting for them.",
      "Publish how consultation input was used, so participation feels worthwhile.",
    ],
  },
  {
    code: "1.4",
    title: "Legitimacy",
    question: "To what extent is your LYC recognized as a legitimate platform for representing youth views?",
    about:
      "Legitimacy reflects how far young people recognize the LYC as a credible and relevant platform that represents their views and interests, both in perception and in practice.",
    feedback: {
      0: "The LYC is largely unknown to young people or not perceived as representing them.",
      1: "Some young people are aware of the LYC or recognize certain members, but this is limited to specific groups or contexts.",
      2: "Your LYC holds solid institutional standing and is recognized by regional public offices. Minor enhancements in publishing reports openly can push you to fully meeting legitimacy goals.",
      3: "The LYC is widely recognized by young people as a credible and relevant platform that represents their views and interests.",
    },
    reflection: [
      "If you asked ten random young people in your town, how many would know your LYC exists?",
      "What evidence do you have that young people trust the council to represent them?",
      "Which visible result could you communicate to strengthen recognition?",
    ],
    actions: [
      "Publish a short, plain-language report of what the LYC achieved this year.",
      "Make membership, mandates, and decisions publicly visible.",
      "Maintain a consistent public presence in the channels local youth actually use.",
      "Collect and share testimonies from young people who benefited from the LYC's work.",
    ],
  },
  {
    code: "1.5",
    title: "Equality and non-discrimination",
    question: "To what extent does your LYC ensure fair and non-discriminatory access to participation?",
    about:
      "The LYC adopts and applies principles and practices that promote equality and non-discrimination, ensuring that all young people have fair opportunities to participate, regardless of their background, identity, or personal circumstances.",
    feedback: {
      0: "Active protocols to counter discrimination or actively welcome disadvantaged groups are currently missing. Co-designing an anti-bias charter with local youth advisors is a vital first step.",
      1: "Some safeguards exist, but they are informal and not consistently applied across the council.",
      2: "Equality practices are largely in place; formalising how you respond to incidents will complete the picture.",
      3: "Clear, fair, and transparent practices ensure all young people can participate on equal terms.",
    },
    reflection: [
      "What happens in your LYC when someone is treated unfairly?",
      "Are your membership criteria written down, public, and genuinely fair?",
      "Which hidden barriers might your current culture create?",
    ],
    actions: [
      "Agree written principles on equality and non-discrimination with your members.",
      "Publish clear and accessible information on how to join.",
      "Define a simple, safe procedure for reporting and responding to discrimination.",
      "Review roles and responsibilities to ensure they are shared fairly.",
    ],
  },
  {
    code: "1.6",
    title: "Accessibility and participation conditions",
    question: "To what extent does your LYC provide accessible conditions for all young people to participate?",
    about:
      "The LYC provides practical conditions that enable all young people to participate effectively in its activities, covering physical space, timing, language, and digital tools, and adapting formats where needed.",
    feedback: {
      0: "Current meeting structures do not account for sensory accessibility or varied schedules. Introducing flexible remote options or physical site upgrades will greatly broaden your council's demographic door.",
      1: "Some accessibility measures exist, but they depend on individual goodwill rather than on agreed practice.",
      2: "Most practical barriers are addressed; reviewing accessibility with participants will close the remaining gaps.",
      3: "Participation conditions are consistently accessible and adapted to the circumstances of young people.",
    },
    reflection: [
      "Could a young person with a disability fully participate in your next meeting?",
      "Do your meeting times work for young people who study or work?",
      "Is your written communication understandable to someone new to the council?",
    ],
    actions: [
      "Check meeting venues for physical accessibility and fix what you can.",
      "Offer hybrid or online participation when it removes a barrier.",
      "Share agendas and documents in advance, in clear youth-friendly language.",
      "Ask participants what would make taking part easier, and act on it.",
    ],
  },
];
