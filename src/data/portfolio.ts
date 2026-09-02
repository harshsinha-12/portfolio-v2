export const resumeLink =
  "https://drive.google.com/file/d/1vkxyMDB5_KpMwt4QXFgT2aqdRizr8Czh/view?usp=sharing";

export const siteConfig = {
  name: "Harsh Sinha",
  title: "Harsh Sinha | AI Engineer",
  description:
    "AI Engineer · Prev Founder's Office @ Multibagg AI · National Finalist IFF-FinTech Olympiad '24 · IIT Patna '27.",
  url: "https://harsh-portfolio-two-sigma.vercel.app/",
  githubUsername: "harshsinha-12",
  role: "Prev Founder's Office and AI Engineer",
  tagline: "Prev  @ Multibagg AI · National Finalist IFF-FinTech Olympiad’24 · IITP'27 · Working on AI Agents, Quant and Backend",
};

/** GitHub contribution graph — tweak months, labels, and sizing here. */
export const githubGraphConfig = {
  /** Rolling window in months — 12 matches GitHub's last-year view */
  months: 12,
  cellSize: 11,
  cellGap: 3,
  showLegend: true,
  showWeekdayLabels: true,
  showMonthLabels: true,
} as const;

export type SocialLink = {
  id: string;
  platform: "linkedin" | "github" | "mail" | "twitter";
  link: string;
  label: string;
};

export const socialMedia: SocialLink[] = [
  {
    id: "social-media-4",
    platform: "twitter",
    link: "https://x.com/sinhaharsh12",
    label: "Twitter",
  },
  {
    id: "social-media-1",
    platform: "linkedin",
    link: "https://www.linkedin.com/in/harshsinha12/",
    label: "LinkedIn",
  },
  {
    id: "social-media-2",
    platform: "github",
    link: "https://www.github.com/harshsinha-12",
    label: "GitHub",
  },
  {
    id: "social-media-3",
    platform: "mail",
    link: "mailto:sinha.harshsep@gmail.com",
    label: "Email",
  },
];

export const connectLink =
  socialMedia.find((s) => s.platform === "twitter")?.link ?? "https://x.com/sinhaharsh12";

export type IntroSegment =
  | { type: "text"; value: string }
  | { type: "hand"; value: string }
  | {
      type: "link";
      label: string;
      href: string;
      previewTitle?: string;
      previewDescription?: string;
    };

export type IntroBullet = {
  id: string;
  segments: IntroSegment[];
};

export const introBullets: IntroBullet[] = [
  {
    id: "intro-1",
    segments: [
      { type: "text", value: "I am currently " },
      { type: "hand", value: "looking for AI Engineering roles" },
      {
        type: "text",
        value: " around AI agents, quant, and backend. Previously, I was ",
      },
      { type: "hand", value: "Founder's Office & AI Engineer" },
      { type: "text", value: " at " },
      {
        type: "link",
        label: "Multibagg AI",
        href: "https://www.multibagg.ai",
        previewTitle: "Multibagg AI",
        previewDescription:
          "AI-powered stock research and market intelligence platform.",
      },
      { type: "text", value: "." },
    ],
  },
  {
    id: "intro-2",
    segments: [
      { type: "text", value: "I love building " },
      { type: "hand", value: "AI agents" },
      {
        type: "text",
        value:
          " — for finance, payments, data pipelines, news, Instagram analysis, and most workflows I can automate.",
      },
    ],
  },
  {
    id: "intro-3",
    segments: [
      { type: "text", value: "I've mainly worked on " },
      {
        type: "link",
        label: "Ask Iris",
        href: "https://www.multibagg.ai/ask-iris",
        previewTitle: "Ask Iris",
        previewDescription:
          "Multibagg AI's AI flagship Multi Agent Chatbot for Indian stock market research.",
      },
      { type: "text", value: " and " },
      {
        type: "link",
        label: "Multibagg AI",
        href: "https://www.multibagg.ai",
        previewTitle: "Multibagg AI",
        previewDescription:
          "AI-powered stock research and market intelligence platform.",
      },
      { type: "text", value: ", which has answered over " },
      { type: "hand", value: "500K+ user queries" },
      {
        type: "text",
        value: " and helps investors daily. It's loved by users and the sharks on ",
      },
      {
        type: "link",
        label: "Shark Tank India Season 5",
        href: "https://www.linkedin.com/posts/shark-tank-india_namitathapar-sharktankindia-sharktankindiaseason5-ugcPost-7418286077645312000-fXBB",
        previewTitle: "Shark Tank India Season 5 — Multibagg AI",
        previewDescription:
          "Shark Tank India's Match-Off featuring Multibagg AI on Sony LIV.",
      },
      { type: "text", value: "." },
    ],
  },
  {
    id: "intro-4",
    segments: [
      { type: "text", value: "I'm in my " },
      { type: "hand", value: "final year of undergrad" },
      { type: "text", value: " at " },
      {
        type: "link",
        label: "IIT Patna",
        href: "https://www.iitp.ac.in/",
        previewTitle: "Indian Institute of Technology Patna",
        previewDescription: "IIT Patna — undergraduate program.",
      },
      { type: "text", value: ". Was also the " },
      { type: "hand", value: "national finalist" },
      { type: "text", value: " at " },
      {
        type: "link",
        label: "IFF–FinTech Olympiad '24",
        href: "https://www.linkedin.com/posts/harshsinha12_fintecholympiad2024-fintech-nationalfinalist-activity-7259242419387314176-kO12",
        previewTitle: "National Finalist — Fintech Olympiad 2024",
        previewDescription:
          "Top 30 among 1 lakh+ applicants; national finals at IFTA 2024, Mumbai — India FinTech Forum.",
      },
      { type: "text", value: ", among the top 30 out of " },
      { type: "hand", value: ">1 lakh" },
      { type: "text", value: " candidates." },
    ],
  },
  {
    id: "intro-5",
    segments: [
      { type: "text", value: "Fun fact: got into " },
      { type: "hand", value: "finance" },
      {
        type: "text",
        value:
          " pre-COVID, watching Dad invest in the stock market. Investing since 2019 — ",
      },
      { type: "hand", value: "was not 18 yet, lol 😅" },
      {
        type: "text",
        value:
          " — generally profitable, with a few ",
      },
      { type: "hand", value: "F&O losses" },
      { type: "text", value: " too. " },
      {
        type: "link",
        label: "Nine out of ten people lose in F&O",
        href: "https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html",
        previewTitle: "SEBI — F&O trader P&L study",
        previewDescription:
          "SEBI research on profit and loss of individual traders in the equity F&O segment.",
      },
      {
        type: "text",
        value: " — stay away unless you actually know what you're doing.",
      },
    ],
  },
];

export type StickerPlacement = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  displayWidth?: string;
  rotate?: number;
};

export type CutoutSticker = {
  id: string;
  src: string;
  width: number;
  height: number;
  tooltip: string;
  rotate: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  displayWidth: string;
  zIndex: number;
  outline?: "default" | "thin" | "plain";
  emit?: "notes";
  musicVideoId?: string;
  mobile?: StickerPlacement;
};

export const experienceStickers: CutoutSticker[] = [
  {
    id: "sticker-headphones",
    src: "/assets/sticker-headphones.webp",
    width: 303,
    height: 412,
    tooltip: "I run on music",
    rotate: 11,
    top: "-1rem",
    right: "max(-10.2rem, calc(-50vw + 50% + 10rem))",
    displayWidth: "4.8rem",
    zIndex: 4,
    emit: "notes",
    musicVideoId: "wtJWkeE-nRE",
    mobile: {
      top: "-0.25rem",
      right: "0.25rem",
      displayWidth: "3rem",
    },
  },
];

/** Flank the GitHub activity card in the About section. */
export const profileStickers: CutoutSticker[] = [
  {
    id: "sticker-marvel",
    src: "/assets/sticker-marvel.webp",
    width: 632,
    height: 332,
    tooltip: "I am a big Marvel fan — probably bigger than Hulk 💪",
    outline: "plain",
    rotate: -7,
    top: "1.5rem",
    left: "-7.5rem",
    displayWidth: "5.4rem",
    zIndex: 6,
    mobile: {
      top: "-1.25rem",
      left: "3.75rem",
      displayWidth: "2.75rem",
    },
  },
  {
    id: "sticker-macbook",
    src: "/assets/sticker-macbook.webp",
    width: 404,
    height: 285,
    tooltip: "this is where the work happens",
    rotate: 8,
    top: "2.5rem",
    right: "-3rem",
    displayWidth: "5.8rem",
    zIndex: 5,
    mobile: {
      top: "4rem",
      right: "-0.5rem",
      displayWidth: "3rem",
    },
  },
];

export const projectStickers: CutoutSticker[] = [
  {
    id: "sticker-coffee",
    src: "/assets/sticker-coffee.webp",
    width: 768,
    height: 768,
    tooltip: "coffee is what keeps me awake",
    rotate: -9,
    top: "-2rem",
    right: "max(-11.2rem, calc(-50vw + 50% + 58rem))",
    displayWidth: "6rem",
    zIndex: 2,
    mobile: {
      top: "-0.5rem",
      right: "9rem",
      displayWidth: "3rem",
    },
  },
];

export type ContentBlock = {
  segments: IntroSegment[];
};

export type Position = {
  title: string;
  duration: string;
  content: ContentBlock[];
};

export type Experience = {
  id: string;
  organisation: string;
  logo: string;
  link: string;
  positions: Position[];
};

export const experiences: Experience[] = [
  {
    id: "exp-multibagg",
    organisation: "Multibagg AI",
    logo: "/assets/multibagg-ai.webp",
    link: "https://www.multibagg.ai",
    positions: [
      {
        title: "Founder's Office & AI Engineer",
        duration: "Jan 2025 - Jun 2026",
        content: [
          {
            segments: [
              {
                type: "text",
                value:
                  "Worked directly with the founder to build and scale production AI systems across agent orchestration, retrieval, evaluation, financial data and user-facing product workflows.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value: "Built core workflows for ",
              },
              {
                type: "link",
                label: "Ask Iris",
                href: "https://www.multibagg.ai/ask-iris",
                previewTitle: "Ask Iris",
                previewDescription:
                  "Multibagg AI's multi-agent investment research assistant.",
              },
              {
                type: "text",
                value:
                  ", a multi-agent investment research assistant that answered 500K+ user queries (",
              },
              {
                type: "link",
                label: "Iris launch",
                href: "https://www.linkedin.com/posts/biased-human_today-we-are-launching-the-most-powerful-ugcPost-7398653952919101440-vvJ_",
                previewTitle: "Ask Iris launch — Multibagg AI",
                previewDescription:
                  "Launch announcement for Iris, Multibagg AI's AI analyst for Indian markets.",
              },
              {
                type: "text",
                value:
                  "). Orchestrated specialized agents and tools for SQL, RAG, web search, citations and streaming across 100K+ documents and 20M+ records.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value:
                  "Created evaluation harnesses across stock, portfolio, screener, ETF, index and industry agents using custom test sets, LLM-as-a-judge scoring, tool-call and citation validation, latency tracking and failure analysis.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value:
                  "Built production document-intelligence pipelines for IPO RHPs, ETF factsheets, annual reports, investor presentations and earnings-call transcripts using Docling/OCR, typed schemas, queue workers and structured extraction. Optimized retrieval across ",
              },
              {
                type: "link",
                label: "Pinecone",
                href: "https://www.pinecone.io",
                previewTitle: "Pinecone",
                previewDescription: "Vector database for AI applications.",
              },
              { type: "text", value: " and " },
              {
                type: "link",
                label: "Qdrant",
                href: "https://qdrant.tech",
                previewTitle: "Qdrant",
                previewDescription: "Vector similarity search engine.",
              },
              {
                type: "text",
                value:
                  " with hybrid search, re-ranking, metadata filters and page-level citations, reducing vector infrastructure costs by up to 80%.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value:
                  "Developed an AI Screener Agent that translates natural-language investing queries into SQL and filter operations, improving reliability through schema mapping, evaluations, logging, guardrails and prompt optimization.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value:
                  "Built financial and real-time market automation across 300+ ratios and indicators and 6K+ companies, covering news, exchange announcements, transcripts, sentiment, market breadth and sector rotation. The resulting ",
              },
              {
                type: "link",
                label: "automated X posts",
                href: "https://x.com/sinhaharsh12/status/1975865353705320477",
                previewTitle: "Twitter market-news automation",
                previewDescription:
                  "Architecture thread on Multibagg AI's AI-native, high-frequency market updates on X.",
              },
              {
                type: "text",
                value: " reached 3.2M+ impressions in six months.",
              },
            ],
          },
          {
            segments: [
              {
                type: "text",
                value:
                  "Designed and tested Redis Cluster deployments across Docker and Azure VMs, validating primary-replica failover, key-access patterns, deployment behaviour and migration strategy.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export type Education = {
  id: string;
  icon: string;
  title: string;
  degree: string;
  duration: string;
  content: string[];
  link?: string;
};

export const educationList: Education[] = [
  {
    id: "education-1",
    icon: "/assets/iitp-logo.png",
    title: "Indian Institute of Technology, Patna",
    degree: "Bachelor of Technology",
    duration: "Aug 2023 - May 2027",
    content: [
      "Major: Computer Science and Engineering",
      "Minor: Data Science and Artificial Intelligence",
    ],
    link: "https://www.iitp.ac.in/",
  },
];

export type Achievement = {
  id: string;
  icon: string;
  companyIcon?: string;
  photo?: string;
  event: string;
  position: string;
  highlight: string;
  article?: string;
  project?: string;
  youtube?: string;
  github?: string;
  rotation?: number;
};

// Hackathon list:

// 1. Anthropic Push to Prod Hackathon
// 2. Google DeepMind Hackathon
// 3. Sarvam
// 4. Warpspeed'23
// 5. Warpspeed: Agentic AI Hackathon
// 6. ETHIndia'24
// 7. ETHIndia'22
// 8. Polkadot Hackathon: Europe Edition
// 9. Web3 Marketing Hackathon
// 10. September Hackathon by Dennis Ivy


export const achievements: Achievement[] = [
  {
    id: "a-anthropic",
    icon: "/assets/anthropic-26.webp",
    companyIcon: "/assets/hackathon-icons/anthropic.png",
    photo: "/assets/anthropic-26.webp",
    event: "Anthropic Push to Prod Hackathon",
    position: "1st Runner Up",
    highlight:
      "2nd among 5K+ applications for building Claude Code as a game.",
    article: "https://x.com/mittalparth_/status/2086438075652067553?s=20/",
    youtube: "https://youtu.be/-WVMaU1-sHE",
    rotation: -2.2,
  },
  {
    id: "a-1",
    icon: "/assets/google-deepmind-26.webp",
    companyIcon: "/assets/hackathon-icons/google-deepmind.webp",
    photo: "/assets/google-deepmind-26.webp",
    event: "Google DeepMind Hackathon",
    position: "Winner",
    highlight:
      "1st place among 4K applications. Built an infinite RPG game generator using Nano Banana.",
    article: "https://x.com/mittalparth_/status/2076292927882682602?s=20",
    youtube: "https://youtu.be/8R3QYKQR10M",
    rotation: -2.5,
  },
  {
    id: "a-2",
    icon: "/assets/sarvam-26.webp",
    companyIcon: "/assets/hackathon-icons/sarvam.svg",
    photo: "/assets/sarvam-26.webp",
    event: "Sarvam Epoch Buildathon",
    position: "2nd Runner Up",
    highlight:
      "2nd runner up among 3K applications. Built a voice-first, interactive language learning game.",
    article: "https://x.com/mittalparth_/status/2082861864984437072?s=20",
    youtube: "https://youtu.be/gadi-osujrs",
    rotation: 1.8,
  },
  {
    id: "a-3",
    icon: "/assets/ethindia_24.webp",
    companyIcon: "/assets/hackathon-icons/ethindia.png",
    photo: "/assets/ethindia_24.webp",
    event: "ETHIndia'24",
    position: "Winner",
    highlight: "Top 10 Winners at India's largest Ethereum hackathon",
    article:
      "https://www.linkedin.com/posts/mittal-parth_super-stoked-to-announce-that-our-team-emerged-activity-7274735259621961729-tkq4",
    project: "https://devfolio.co/projects/khoj-3336",
    youtube: "https://www.youtube.com/live/qJ4OCtnvjUY?si=VkcnHEdwJTEEDlMg&t=4718",
    rotation: -1.2,
  },
  {
    id: "a-4",
    icon: "/assets/warpspeed-24.webp",
    companyIcon: "/assets/hackathon-icons/lightspeed.png",
    photo: "/assets/warpspeed-24.webp",
    event: "Warpspeed'23",
    position: "1st Runner Up",
    highlight: "1st runner up at Lightspeed's flagship AI hackathon, among 107 hackers.",
    article: "https://shorturl.at/fhjsT",
    rotation: 2.2,
  },
  {
    id: "a-5",
    icon: "/assets/ethindia-22.webp",
    companyIcon: "/assets/hackathon-icons/ethglobal.png",
    photo: "/assets/ethindia-22.webp",
    event: "ETHIndia'22",
    position: "Winner",
    highlight:
      "Top 12 Winners at the world's largest Ethereum hackathon, among 20K+ registrations.",
    article:
      "https://www.thehindu.com/news/cities/Mangalore/nitk-iiit-delhi-team-makes-it-to-top-12-winners-in-ethindia-22/article66238923.ece",
    project: "https://devfolio.co/projects/chargeswap-3527",
    youtube: "https://youtu.be/9rieTya8Yds?t=3908",
    rotation: 1.4,
  },
  {
    id: "a-6",
    icon: "/assets/warpspeed-25.webp",
    companyIcon: "/assets/hackathon-icons/lightspeed.png",
    photo: "/assets/warpspeed-25.webp",
    event: "Warpspeed: Agentic AI Hackathon",
    position: "Runners Up, Base Track",
    highlight: "Built an ambient virtual assistant before ChatGPT Pulse.",
    project: "https://devfolio.co/projects/aeva-58d2",
    rotation: -1.8,
  },

  {
    id: "a-7",
    icon: "/assets/polkadot-hack.webp",
    companyIcon: "/assets/hackathon-icons/polkadot.jpeg",
    photo: "/assets/polkadot-hack.webp",
    event: "Polkadot Hackathon: Europe Edition",
    position: "2nd Runner Up, ink! Smart Contracts",
    highlight: "Built GreenTrust for organic farming certification via decentralized PGSs.",
    article:
      "https://www.linkedin.com/posts/mittal-parth_hackathon-winners-web3-activity-7048340759116214272-eJvo",
    github: "https://github.com/pranav2305/GreenTrust",
    rotation: -2,
  },
  {
    id: "a-8",
    icon: "/assets/web3-marketing-hack.webp",
    companyIcon: "/assets/hackathon-icons/web3-marketing.jpg",
    photo: "/assets/web3-marketing-hack.webp",
    event: "Web3 Marketing Hackathon",
    position: "Runner Up",
    highlight: "2nd in Polkadot Challenge I. Creative marketing strategies.",
    article: "https://x.com/polkadotsub0/status/1998425721916551355",
    project:
      "https://taikai.network/OutofOrdinary/hackathons/web3mkthack/projects/cmi0skdbk0257vu09q3n8m44u/idea",
    rotation: 2.5,
  },
  {
    id: "a-9",
    icon: "/assets/september-hack.webp",
    companyIcon: "/assets/hackathon-icons/dennisivy.png",
    photo: "/assets/september-hack.webp",
    event: "September Hackathon by Dennis Ivy",
    position: "Winner",
    highlight: "Best portfolio website among 450+ participants globally.",
    youtube: "https://www.youtube.com/watch?v=X2473En3h_o&t=5278s",
    project: "https://parthmittal.netlify.app/",
    rotation: -1.5,
  },
];

export type ProjectStackItem = { name: string; icon?: string };

export type Project = {
  id: string;
  title: string;
  github?: string;
  readme?: string;
  link?: string;
  youtube?: string;
  image?: string;
  video?: string;
  content: string;
  stack: ProjectStackItem[];
  highlight?: string;
};

export const projects: Project[] = [
  {
    id: "recovery-os",
    title: "RecoveryOS",
    github: "https://github.com/harshsinha-12/rzpy-agent",
    readme: "https://github.com/harshsinha-12/rzpy-agent#readme",
    link: "https://rzpy-agent-web.vercel.app",
    image: "/assets/recoveryos.webp",
    content:
      "An explainable revenue-recovery system for Razorpay merchants: AI proposes one bounded action, deterministic policy guards execution, and durable workflows follow failed payments to auditable outcomes.",
    highlight: "Razorpay AI Buildathon · verified Test Mode recovery flow",
    stack: [
      { name: "Next.js" },
      { name: "Fastify" },
      { name: "Redis" },
      { name: "PostgreSQL" },
      { name: "OpenAI" },
      { name: "Razorpay" },
    ],
  },
  {
    id: "llm-trading-arena-frontend",
    title: "LLM Trading Arena",
    github: "https://github.com/harshsinha-12/-the-llm-trading-arena-frontend",
    readme:
      "https://github.com/harshsinha-12/-the-llm-trading-arena-frontend#readme",
    link: "https://the-llm-trading-arena-frontend.vercel.app",
    image: "/assets/llm-trading-arena.webp",
    content:
      "A read-only research dashboard where LLMs paper-trade the Nifty 50 under realistic constraints, with rankings, trade history, portfolio analytics and deterministic Redis-backed replay.",
    highlight: "Frontend · Nifty 50 paper-trading arena",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Redis" },
      { name: "OpenAI" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    id: "vritta-ai",
    title: "Vritta AI",
    github: "https://github.com/harshsinha-12/Vritta",
    readme: "https://github.com/harshsinha-12/Vritta#readme",
    image: "/assets/vritta.webp",
    content:
      "A financial event-intelligence platform that organizes filings, disclosures and news into structured, traceable events with materiality and source context for Indian-equity research.",
    highlight: "Structured event intelligence for Indian equities",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Redis" },
      { name: "Vitest" },
    ],
  },
  {
    id: "instagram-creative-intelligence",
    title: "Instagram Creative Intelligence",
    github: "https://github.com/harshsinha-12/instagram-analysis",
    readme: "https://github.com/harshsinha-12/instagram-analysis#readme",
    link: "https://instagram-analysis-red.vercel.app",
    image: "/assets/instagram-analysis.webp",
    content:
      "A multi-agent analysis pipeline that ranks public Instagram posts, extracts video and audio evidence, and turns measurable creative patterns into an adaptable strategy report.",
    highlight: "Evidence-first analysis · reports, transcripts and frame sampling",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "OpenAI" },
      { name: "FFmpeg" },
      { name: "Zod" },
    ],
  },
  {
    id: "llm-trading-arena-engine",
    title: "LLM Trading Arena Engine",
    github: "https://github.com/harshsinha-12/the-llm-trading-arena-backend",
    readme:
      "https://github.com/harshsinha-12/the-llm-trading-arena-backend#readme",
    image: "/assets/llm-trading-arena-engine.webp",
    content:
      "A TypeScript paper-trading engine for LLMs on the Nifty 50, with technical features, portfolio-aware risk context, Redis state and reproducible execution rules.",
    highlight: "Backend · quantitative features and auditable simulation",
    stack: [
      { name: "TypeScript" },
      { name: "Node.js" },
      { name: "Redis" },
    ],
  },
  {
    id: "go-rabbit",
    title: "Go Rabbit",
    github: "https://github.com/harshsinha-12/go-rabbit",
    readme: "https://github.com/harshsinha-12/go-rabbit#readme",
    link: "https://go-rabbit-sable.vercel.app",
    image: "/assets/go-rabbit.webp",
    content:
      "An agentic contributor assistant that scopes Go issues, scans repositories, generates and validates focused patches, and prepares draft pull requests behind explicit safety gates.",
    highlight: "Issue → validated patch → draft PR",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "OpenAI" },
      { name: "GitHub" },
      { name: "Zod" },
    ],
  },
];

export const navSections = [
  { id: "profile", label: "About" },
  { id: "hackathons", label: "Hackathons" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];
