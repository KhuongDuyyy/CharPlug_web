import Image from "next/image";

import { Typography } from "@/components/ui/typography";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cp-screen flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,241,246,0.82),rgba(252,231,243,0.50))] px-5 pb-4 pt-[max(16px,var(--cp-safe-top))]">
        <div className="mx-auto flex max-w-[430px] items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src="/icon.png" alt="ChargePlug" width={44} height={44} className="h-11 w-11 object-cover" />
          </div>
          <Typography as="div" variant="logo" className="text-[color:#B4A3F0]">
            ChargePlug
          </Typography>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-10 pt-5">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
