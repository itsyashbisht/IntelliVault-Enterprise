"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BillingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--color-canvas)] px-4">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-success)]/10">
          <Check
            size={22}
            strokeWidth={2.5}
            className="text-[var(--color-success)]"
          />
        </div>

        <h1 className="text-[22px] font-semibold tracking-[-0.4px] text-[var(--color-ink)]">
          You&apos;re now on Pro
        </h1>

        <p className="mt-2 text-[14px] leading-6 text-[var(--color-ink-subtle)]">
          Your limits have been upgraded.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex min-h-[40px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Go to dashboard
          <ArrowRight size={14} strokeWidth={2} />
        </Link>

        <p className="mt-4 text-[12px] text-[var(--color-ink-tertiary)]">
          Redirecting in a few seconds…
        </p>
      </div>
    </main>
  );
}
