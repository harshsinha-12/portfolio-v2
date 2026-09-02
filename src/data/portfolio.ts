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
};

export const experienceStickers: CutoutSticker[] = [
  {
    id: "sticker-headphones",
    src: "/assets/sticker-headphones.webp",
    width: 303,
    height: 412,
    tooltip: "I run on music",
    rotate: 11,
    top: "16.4rem",
    left: "max(-10.4rem, calc(-50vw + 50% + 1.68rem))",
    displayWidth: "4.8rem",
    zIndex: 4,
    emit: "notes",
    musicVideoId: "wtJWkeE-nRE",
  },
  {
    id: "sticker-macbook",
    src: "/assets/sticker-macbook.webp",
    width: 404,
    height: 285,
    tooltip: "this is where the work happens",
    rotate: 7,
    top: "20.1rem",
    left: "max(-8.6rem, calc(-50vw + 50% + 2.85rem))",
    displayWidth: "5.8rem",
    zIndex: 3,
  },
];

export const projectStickers: CutoutSticker[] = [
  {
    id: "sticker-sushi",
    src: "/assets/sticker-sushi.webp",
    width: 1080,
    height: 1080,
    tooltip: "coffee is overrated, ask for sushi",
    rotate: -9,
    bottom: "8.6rem",
    right: "max(-11.6rem, calc(-50vw + 50% + 0.22rem))",
    displayWidth: "6.4rem",
    zIndex: 2,
  },
  {
    id: "sticker-shoes",
    src: "/assets/sticker-shoes.webp",
    width: 421,
    height: 176,
    tooltip: "oh, I also dance :)",
    rotate: -8,
    bottom: "4.4rem",
    right: "max(-8.4rem, calc(-50vw + 50% + 1.85rem))",
    displayWidth: "6.2rem",
    zIndex: 5,
  },
  {
    id: "sticker-buddha",
    src: "/assets/sticker-buddha.webp",
    width: 283,
    height: 408,
    tooltip: "meditation is the secret to my energy",
    outline: "plain",
    rotate: -12,
    bottom: "0.8rem",
    right: "max(-12.5rem, calc(-50vw + 50% + 0.1rem))",
    displayWidth: "3.5rem",
    zIndex: 1,
  },
  {
    id: "sticker-dino",
    src: "/assets/sticker-dino.webp",
    width: 1080,
    height: 1080,
    tooltip: "nothing, i find this dino cool",
    outline: "plain",
    rotate: 10,
    bottom: "0.2rem",
    right: "max(-6.8rem, calc(-50vw + 50% + 4.1rem))",
    displayWidth: "5.2rem",
    zIndex: 6,
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
    icon: "/assets/nitk-logo.png",
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
    id: "project-1",
    title: "Claude City",
    github: "https://github.com/mittal-parth/claude-clan",
    link: "https://playclaude.vercel.app/",
    youtube: "https://youtu.be/-WVMaU1-sHE",
    image: "/assets/claude-city.webp",
    video: "/assets/videos/claude-city.webm",
    content:
      "Turns your codebase and GitHub PRs into a live isometric city where AI agents build and review in real time.",
    highlight: "1st Runner Up - Anthropic Push to Prod Hackathon",
    stack: [
      { name: "TypeScript" },
      { name: "React" },
      { name: "Node.js" },
      { name: "Vercel" },
    ],
  },
  {
    id: "project-2",
    title: "Sadak",
    github: "https://github.com/mittal-parth/sadak",
    link: "https://playsadak.vercel.app/",
    youtube: "https://youtu.be/gadi-osujrs",
    image: "/assets/sadak.webp",
    video: "/assets/videos/sadak.webm",
    content:
      "3D, voice-first, Indic language learning game.",
    highlight: "2nd Runner Up - Sarvam Epoch Buildathon",
    stack: [
      { name: "TypeScript" },
      { name: "Supabase" },
      { name: "Next.js" },
      { name: "Sarvam", icon: "/assets/sarvam-logo.svg" },
      { name: "Vercel" },
      { name: "Three.js" },
    ],
  },
  {
    id: "project-3",
    title: "Kahani",
    github: "https://github.com/harshagw/kahani",
    link: "https://playkahani.vercel.app/",
    youtube: "https://youtu.be/8R3QYKQR10M",
    image: "/assets/kahani.webp",
    video: "/assets/videos/kahani.webm",
    content:
      "An RPG game generator that uses Nano Banana to create worlds and assets as you play and progress.",
    highlight: "Winner - Google DeepMind Bangalore Hackathon",
    stack: [
      { name: "TypeScript" },
      { name: "Supabase" },
      { name: "Next.js" },
      { name: "Gemini" },
      { name: "Vercel" },
      { name: "Sarvam", icon: "/assets/sarvam-logo.svg" },
    ],
  },
  {
    id: "project-4",
    title: "Khoj",
    github: "https://github.com/mittal-parth/Khoj",
    link: "https://playkhoj.com/",
    image: "/assets/khoj.webp",
    video: "/assets/videos/khoj.webm",
    youtube: "https://youtu.be/98OJuvBur6s",
    content:
      "A geo-location based treasure hunt app where the answer to every clue is a physical location.",
    highlight: "Winner - ETHIndia'24, $5000 in grants",
    stack: [
      { name: "Solidity" },
      { name: "TypeScript" },
      { name: "React.js" },
      { name: "TailwindCSS" },
      { name: "Gemini" },
      { name: "Thirdweb" },
      { name: "IPFS" },
    ],
  },
  {
    id: "project-5",
    title: "Echo",
    github: "https://github.com/imApoorva36/Echo",
    link: "https://testflight.apple.com/join/TpYrhKRy",
    youtube: "https://www.youtube.com/watch?v=ncCJL2eEslc",
    image: "/assets/echo-1.webp",
    video: "/assets/videos/echo.webm",
    content:
      "A proactive AI assistant that's always listening and executes without you having to ask.",
    stack: [
      { name: "TypeScript" },
      { name: "React Native" },
      { name: "Node.js" },
      { name: "Supabase" },
      { name: "Vercel AI SDK" },
    ],
  },
  {
    id: "project-6",
    title: "Hackathon Curation Agent",
    github: "https://github.com/mittal-parth/hackathon-curation-agent",
    link: "https://x.com/HackClubNITK",
    image: "/assets/hackclub.webp",
    video: "/assets/videos/hackathon-curation-agent.webm",
    youtube:
      "https://www.linkedin.com/posts/mittal-parth_as-hackclub-under-web-enthusiasts-club-ugcPost-7379181094195113985-diSJ/",
    content:
      "Curates hackathons from email newsletters, evaluates them with AI, and posts the best ones to Twitter.",
    highlight: "Curated 150+ hackathons",
    stack: [
      { name: "Python" },
      { name: "Gemini" },
      { name: "Gmail API" },
      { name: "Google Sheets API" },
      { name: "Twitter API" },
      { name: "Google Cloud Platform" },
    ],
  }
];

export const navSections = [
  { id: "profile", label: "About" },
  { id: "hackathons", label: "Hackathons" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];
