import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillMail,
  AiFillYoutube,
} from "react-icons/ai";
import {
  SiDjango,
  SiDocker,
  SiFastify,
  SiFfmpeg,
  SiFlask,
  SiGmail,
  SiGooglesheets,
  SiGooglecloud,
  SiGraphql,
  SiGithub,
  SiIpfs,
  SiJquery,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiQdrant,
  SiRazorpay,
  SiReact,
  SiRedis,
  SiGrafana,
  SiGit,
  SiJavascript,
  SiRubyonrails,
  SiSolidity,
  SiSupabase,
  SiTailwindcss,
  SiThirdweb,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVitest,
  SiZod,
} from "react-icons/si";
import { FaHardHat, FaRust } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import { TbBrandAzure } from "react-icons/tb";
import type { IconType } from "react-icons";

export const socialIconMap: Record<string, IconType> = {
  linkedin: AiFillLinkedin,
  github: AiFillGithub,
  mail: AiFillMail,
  twitter: FaXTwitter,
};

export const stackIconMap: Record<string, IconType> = {
  Solidity: SiSolidity,
  Typescript: SiTypescript,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Next.js": SiNextdotjs,
  "React.js": SiReact,
  React: SiReact,
  "React Native": SiReact,
  TailwindCSS: SiTailwindcss,
  "Tailwind CSS": SiTailwindcss,
  Vercel: SiVercel,
  "Three.js": SiThreedotjs,
  Gemini: RiGeminiFill,
  Thirdweb: SiThirdweb,
  IPFS: SiIpfs,
  "Node.js": SiNodedotjs,
  Supabase: SiSupabase,
  "Vercel AI SDK": SiVercel,
  Python: SiPython,
  "Gmail API": SiGmail,
  "Google Sheets API": SiGooglesheets,
  "Twitter API": FaXTwitter,
  "Google Cloud Platform": SiGooglecloud,
  OpenAI: RiOpenaiFill,
  Fastify: SiFastify,
  FFmpeg: SiFfmpeg,
  GitHub: SiGithub,
  Git: SiGit,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  Grafana: SiGrafana,
  Razorpay: SiRazorpay,
  Redis: SiRedis,
  Vitest: SiVitest,
  Zod: SiZod,
  Flask: SiFlask,
  Rust: FaRust,
  "Ruby on Rails": SiRubyonrails,
  jQuery: SiJquery,
  "Web3.js": SiSolidity,
  HardHat: FaHardHat,
  Arduino: SiSolidity,
  "Push Protocol": IoIosNotificationsOutline,
  Django: SiDjango,
  GraphQL: SiGraphql,
  "Dot Net Core MVC 6": SiGraphql,
  Azure: TbBrandAzure,
  Docker: SiDocker,
  Qdrant: SiQdrant,
  "Quant Finance": MdCandlestickChart,
};

/** Raster/SVG brand marks when no Simple Icon exists (e.g. Pinecone). */
export const stackImageIconMap: Record<string, string> = {
  Pinecone: "/assets/favicons/pinecone.png",
  BullMQ: "/assets/favicons/bullmq.png",
};

export function getStackIcon(name: string): IconType | null {
  return stackIconMap[name] ?? null;
}

export function getStackImageIcon(name: string): string | null {
  return stackImageIconMap[name] ?? null;
}

export { AiFillGithub, AiFillYoutube };
