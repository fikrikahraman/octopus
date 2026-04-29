"use client";

import { IconRocket } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const POLL_INTERVAL = 300_000;
const INITIAL_DELAY = 10_000;

function showRefreshToast() {
  toast.custom(
    (t) => (
      <div className="relative flex w-[380px] items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/5 dark:border-primary/30 dark:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_8%,transparent),0_10px_40px_-10px_color-mix(in_oklch,var(--primary)_40%,transparent)]">
        <div className="w-1 shrink-0 bg-primary" />
        <div className="flex flex-1 items-start gap-3 p-3.5">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <IconRocket size={16} stroke={2} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-semibold leading-tight text-foreground">
                New version available
              </p>
              <p className="text-[12.5px] leading-snug text-muted-foreground">
                Refresh the page to get the latest updates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-card"
              >
                Refresh
              </button>
              <a
                href="/docs/changelog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 items-center rounded-md px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                See what&apos;s new →
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </button>
        </div>
      </div>
    ),
    { duration: Infinity },
  );
}

export function VersionChecker() {
  const currentBuildId = process.env.NEXT_PUBLIC_BUILD_ID;
  const shownRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __showRefreshToast?: () => void }).__showRefreshToast = showRefreshToast;
    }

    const check = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const { buildId } = await res.json();
        if (buildId && buildId !== currentBuildId && !shownRef.current) {
          shownRef.current = true;
          showRefreshToast();
        }
      } catch {
        // ignore network errors
      }
    };

    const timeout = setTimeout(check, INITIAL_DELAY);
    const interval = setInterval(check, POLL_INTERVAL);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [currentBuildId]);

  return null;
}
