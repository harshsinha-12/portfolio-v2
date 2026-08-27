export const resumeLink =
  "https://drive.google.com/file/d/1vkxyMDB5_KpMwt4QXFgT2aqdRizr8Czh/view?usp=sharing";

export const siteConfig = {
  name: "Parth Mittal",
  title: "Parth Mittal | Software Developer",
  description:
    "Member of Technical Staff at Oracle. 13x hackathon winner. Builder of Khoj, Echo, and open-source tools.",
    url: "https://mittalparth.dev",
  githubUsername: "mittal-parth",
  role: "Member of Technical Staff",
  tagline: "MTS @ Oracle · 15x Hackathon Winner · NITK'24 · PBA-5",
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
    link: "https://x.com/mittalparth_",
    label: "Twitter",
  },
  {
    id: "social-media-1",
    platform: "linkedin",
    link: "https://www.linkedin.com/in/mittal-parth",
    label: "LinkedIn",
  },
  {
    id: "social-media-2",
    platform: "github",
    link: "https://www.github.com/mittal-parth",
    label: "GitHub",
  },
  {
    id: "social-media-3",
    platform: "mail",
    link: "mailto:work.parthmittal@gmail.com",
    label: "Email",
  },
];

export const connectLink =
  socialMedia.find((s) => s.platform === "twitter")?.link ?? "https://x.com/mittalparth_";

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
      { type: "text", value: "I am currently a " },
      { type: "hand", value: "Member of Technical Staff" },
      { type: "text", value: " at " },
      {
        type: "link",
        label: "Oracle",
        href: "https://www.oracle.com",
        previewTitle: "Oracle",
        previewDescription: "Cloud infrastructure and enterprise software.",
      },
      {
        type: "text",
        value:
          ", working in the Exadata Database as a Service, Control Plane team.",
      },
    ],
  },
  {
    id: "intro-2",
    segments: [
      { type: "text", value: "I like doing " },
      { type: "hand", value: "hackathons" },
      {
        type: "text",
        value: ". Participated in 35+, won 15 (recently the Google DeepMind ",
      },
      {
        type: "link",
        label: "hackathon",
        href: "https://x.com/mittalparth_/status/2076292927882682602?s=46",
        previewTitle: "Google DeepMind Hackathon",
        previewDescription: "Winner announcement on X.",
      },
      { type: "text", value: "), and judged 3." },
    ],
  },
  {
    id: "intro-3",
    segments: [
      { type: "text", value: "I used to lead a team of 40+ student developers, building " },
      {
        type: "link",
        label: "IRIS",
        href: "https://about.iris.nitk.ac.in/",
        previewTitle: "IRIS, NITK",
        previewDescription: "Institute MIS with 10K+ active users.",
      },
      { type: "text", value: " - an MIS with 10K+ active users." },
    ],
  },
  {
    id: "intro-4",
    segments: [
      { type: "text", value: "Graduated from " },
      {
        type: "link",
        label: "NITK",
        href: "https://www.nitk.ac.in/",
        previewTitle: "NITK Surathkal",
        previewDescription: "National Institute of Technology Karnataka.",
      },
      { type: "text", value: " in 2024. Also an alumnus of the " },
      {
        type: "link",
        label: "Polkadot Blockchain Academy",
        href: "https://polkadot.academy/",
        previewTitle: "Polkadot Blockchain Academy",
        previewDescription: "Intensive blockchain developer program.",
      },
      { type: "text", value: " @ National University of Singapore." },
    ],
  },
  {
    id: "intro-5",
    segments: [
      { type: "text", value: "Fun fact: I was " },
      {
        type: "link",
        label: "featured",
        href: "https://www.linkedin.com/posts/mittal-parth_look-mom-i-am-on-the-times-square-ugcPost-7324078226178215936-tat9/",
        previewTitle: "Times Square feature",
        previewDescription: "Featured on Times Square by Talent Protocol.",
      },
      { type: "text", value: " on the Times Square by Talent Protocol!" },
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

export type ContentBlock = { text: string; link?: string };

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
    id: "exp-oracle",
    organisation: "Oracle, India",
    logo: "/assets/oracle.jpg",
    link: "https://www.oracle.com/in/",
    positions: [
      {
        title: "Member of Technical Staff",
        duration: "Oct 2025 - Present",
        content: [
          {
            text: "Working on various projects in the Database as a Service, Control Plane team of Oracle Cloud Infrastructure.",
          },
          {
            text: "Developed a new workflow to safely delete orphaned OCI Object Storage Service backup storage, saving ~$45M / year.",
          },
          {
            text: "Reduced the average ExaCS Object Storage based backup deletion time by ~70% over the past 1 year.",
          },
          {
            text: "Worked on adding support for cross-region replicated backups on ExaCS",
          },
        ],
      },
      {
        title: "Member of Technical Staff - 1",
        duration: "Jul 2024 - Sep 2025",
        content: [
          {
            text: "Pending US patent application for building an AI On-Call Agent using an internal agentic framework.",
          },
          {
            text: "Developed a common integration test framework for ExaCS, ExaDB-XS and ExaC@C, reducing code maintenance by ~67% and increased coverage by ~50%",
          },
        ],
      },
      {
        title: "Member of Technical Staff Intern",
        duration: "May 2023 - Jul 2023",
        content: [
          {
            text: "Worked with the Exadata Cloud@Customer team in the Database Unit.",
          },
          {
            text: "Wrote APIs in Java to help gracefully migrate a running ExaC@C infrastructure to a new region in the case of a region failure.",
          },
        ],
      },
    ],
  },
  {
    id: "exp-averlon",
    organisation: "Averlon",
    logo: "/assets/averlon.jpg",
    link: "https://averlon.ai/",
    positions: [
      {
        title: "Software Developer Intern",
        duration: "Sept 2023 - Feb 2024",
        content: [
          {
            text: "Averlon is an AI-powered platform that identifies exploitable security vulnerabilities and helps teams fix them automatically.",
          },
          {
            text: "I added support for the discoverability of Microsoft Azure assets utilising Go and Gremlin..",
          },
          {
            text: "Worked on extending support for Azure for reachability analysis of assets for cloud security posture management.",
          }
        ],
      },
    ],
  },
  {
    id: "exp-iris",
    organisation: "IRIS, NITK",
    logo: "/assets/iris-logo.png",
    link: "https://about.iris.nitk.ac.in/",
    positions: [
      {
        title: "Tech Lead",
        duration: "Apr 2023 - Apr 2024",
        content: [
          {
            text: "IRIS is the official MIS software of NITK, one of India's premier STEM universities. With 24K+ users, 10K+ app downloads and 55+ process digitised, it is completely developed and maintained by students.",
          },
          {
            text: "Led a team of 40+ students across 5 teams as the Tech Lead in the year 2023-24.",
          },
          {
            text: "Supported high-impact digitization projects such as the Testing & Consultancy module, which handled 1000+ projects from 650+ companies, and the Non-Teaching Staff Recruitment portal, which managed 2000+ applications.",
          },
          {
            text: "Contributed to workflows serving large student groups, including the National Education Policy based course allocation for 2000+ students, Hostel Elections with 6.5k votes, and Hostel Complaints 2.0 with 500+ complaints filed and 350+ resolved in four months.",
          },
          {
            text: "Helped scale IRIS Forms, our in-house alternative to Google Forms, which grew to 150,000+ hits during the year.",
          },
          {
            text: "Collaborated closely with product managers, developers, faculty, MIS office, and institute stakeholders to continue the digital transformation at NITK.",
          },
        ],
      },
      {
        title: "Web Lead",
        duration: "Apr 2022 - Apr 2024",
        content: [
          {
            text: "Managed a team of 6 student developers while also overlooking multiple modules.",
          },
          {
            text: "Designed and developed the official recruitment portal for non-teaching staff with an admin panel, RBAC, email notifications and payment integration. Managed 2K+ applications in its first month.",
          },
          {
            text: "Added product enhancements to the Placement Cell module used 1K+ users every year for managing all placement and internship related activities at NITK digitially.",
          },
          {
            text: "Built the public facing website for the Career Development Centre of NITK.",
          },
        ],
      },
      {
        title: "Web Developer",
        duration: "Nov 2021 - Apr 2022",
        content: [
          {
            text: "Worked on adding Conditional Fields support to the Forms Module.",
          },
          {
            text: "Revamped the Faculty Appraisal Module used annually by all teaching staff at NITK.",
          },
        ],
      },
      {
        title: "Web Developer Intern",
        duration: "Jun 2021 - Oct 2021",
        content: [
          {
            text: "Developed a multi-role approval flow system to facilitate data collection and display on the Institute's Department Websites.",
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
    title: "National Institute of Technology Karnataka, Surathkal",
    degree: "Bachelor of Technology",
    duration: "December 2020 - May 2024",
    content: [
      "Major: Electronics and Communication Engineering",
      "Minor: Information Technology",
    ],
    link: "https://www.nitk.ac.in/",
  },
  {
    id: "education-2",
    icon: "/assets/pba_logo.jpeg",
    title: "Polkadot Blockchain Academy",
    degree: "Distinction",
    duration: "May 2024 - June 2024",
    content: [
      "Graduated with a distinction in the fifth cohort at the National University of Singapore.",
    ],
    link: "https://polkadot.academy/",
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
