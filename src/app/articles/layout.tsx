import { SoundProvider } from "@/components/sound/SoundProvider";

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SoundProvider>{children}</SoundProvider>;
}
