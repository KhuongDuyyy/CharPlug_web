"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";
import { useMockApp } from "@/providers/mock-app-provider";

type TabItem = {
  labelKey: string;
  href: string;
  icon: IconSymbolName;
  isScan?: boolean;
};

const tabs: TabItem[] = [
  { labelKey: "tab_dashboard", href: "/dashboard", icon: "bolt.fill" },
  { labelKey: "tab_products", href: "/plans", icon: "cart.fill" },
  { labelKey: "tab_scan", href: "/scan", icon: "qrcode.viewfinder", isScan: true },
  { labelKey: "tab_stations", href: "/stations", icon: "ev.charger.fill" },
  { labelKey: "tab_account", href: "/account", icon: "person.fill" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useMockApp();

  return (
    <div className="cp-screen flex min-h-screen bg-background text-foreground md:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.10),transparent_24%),var(--cp-background)]">
      <aside className="hidden w-[248px] shrink-0 border-r border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.7),transparent)] px-5 py-6 md:flex md:flex-col md:gap-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.75),transparent)]">
        <BrandBlock />
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const active = isTabActive(pathname, tab.href);
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "cp-press flex items-center gap-3 rounded-2xl border px-4 py-3 text-left",
                  active ? "border-border bg-accent-soft text-accent" : "border-transparent text-muted"
                )}
              >
                <IconSymbol name={tab.icon} size={18} />
                <Typography as="span" variant="body" className={cn("font-semibold", active ? "text-accent" : "text-muted")}>
                  {t(tab.labelKey)}
                </Typography>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,241,246,0.82),rgba(252,231,243,0.50))] px-5 pb-4 pt-[max(16px,var(--cp-safe-top))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96),rgba(51,65,85,0.82))]">
          <BrandBlock compact />
        </header>

        <div className="min-h-0 flex-1">{children}</div>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(255,255,255,0.98)] px-4 pb-[max(12px,var(--cp-safe-bottom))] pt-2 backdrop-blur md:hidden dark:bg-[rgba(15,23,42,0.98)]">
          <div className="mx-auto flex max-w-[430px] items-end justify-between">
            {tabs.map((tab) => {
              const active = isTabActive(pathname, tab.href);
              const content = (
                <div
                  className={cn(
                    "flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2",
                    tab.isScan
                      ? "translate-y-[-14px] rounded-full bg-accent px-5 py-4 text-on-accent shadow-glass"
                      : active
                        ? "bg-accent-soft text-accent"
                        : "text-muted"
                  )}
                >
                  <IconSymbol name={tab.icon} size={tab.isScan ? 22 : 18} />
                  {!tab.isScan ? (
                    <Typography as="span" variant="caption" className={cn("font-medium", active ? "text-accent" : "text-muted")}>
                      {t(tab.labelKey)}
                    </Typography>
                  ) : null}
                </div>
              );

              if (active && tab.href === "/account" && pathname === "/account") {
                return (
                  <button key={tab.href} onClick={() => router.replace("/account?reset=1")}>
                    {content}
                  </button>
                );
              }

              return (
                <Link key={tab.href} href={tab.href}>
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function BrandBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "max-w-[430px]")}>
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
        <Image src="/icon.png" alt="ChargePlug" width={44} height={44} className="h-11 w-11 object-cover" />
      </div>
      <div className="min-w-0">
        <Typography as="div" variant="logo" className="text-[color:#B4A3F0]">
          ChargePlug
        </Typography>
      </div>
    </div>
  );
}

function isTabActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
