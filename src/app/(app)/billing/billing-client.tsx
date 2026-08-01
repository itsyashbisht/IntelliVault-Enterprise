"use client";

import { cn } from "@/lib/utils";
import type { PlanType } from "@/lib/plan";
import { useState } from "react";
import { toast } from "sonner";

export type BillingPageData = {
  plan: PlanType;
  messageCount: number;
  messageLimit: number;
  documentCount: number;
  documentLimit: number;
  workspaceCount: number;
  workspaceLimit: number;
  messageResetAt: string;
  canManageBilling: boolean;
};

function planBadgeLabel(plan: PlanType) {
  return plan.toUpperCase();
}

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] text-[var(--color-ink-muted)]">
          {label}
        </span>
        <span className="font-mono text-[13px] tabular-nums text-[var(--color-ink-tertiary)]">
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-hairline)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

async function postJson(url: string, body?: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Request failed");
  }
  return json.data as { checkoutUrl?: string; portalUrl?: string };
}

export default function BillingClient({ data }: { data: BillingPageData }) {
  const [loading, setLoading] = useState<
    "upgrade" | "manage" | "cancel" | null
  >(null);
  const isFree = data.plan === "free";
  const showDanger = !isFree && data.canManageBilling;

  const openPortal = async (action: "manage" | "cancel") => {
    setLoading(action);
    try {
      const { portalUrl } = await postJson("/api/billing/portal");
      if (!portalUrl) throw new Error("No portal URL returned");
      window.location.href = portalUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open portal");
      setLoading(null);
    }
  };

  const upgrade = async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      toast.error("Upgrade is not configured");
      return;
    }
    setLoading("upgrade");
    try {
      const { checkoutUrl } = await postJson("/api/billing/checkout", {
        priceId,
      });
      if (!checkoutUrl) throw new Error("No checkout URL returned");
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start upgrade"
      );
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-[var(--color-ink)] sm:text-[28px]">
          Billing
        </h1>
        <p className="text-[14px] text-[var(--color-ink-subtle)]">
          Plan, usage, and subscription for your account.
        </p>
      </header>

      {/* Plan card */}
      <section className="rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] font-medium uppercase tracking-[0.4px] text-[var(--color-ink-tertiary)]">
              Current plan
            </p>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.06em]",
                  isFree
                    ? "border-[var(--color-hairline)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]"
                    : "border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                )}
              >
                {planBadgeLabel(data.plan)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {isFree ? (
              <button
                type="button"
                onClick={upgrade}
                disabled={loading !== null}
                className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-3.5 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading === "upgrade"
                  ? "Starting checkout…"
                  : "Upgrade to Pro"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openPortal("manage")}
                disabled={loading !== null || !data.canManageBilling}
                className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-[8px] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3.5 py-2 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading === "manage" ? "Opening…" : "Manage subscription"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Usage meters */}
      <section className="rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-6">
        <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.4px] text-[var(--color-ink-tertiary)]">
          Usage
        </p>
        <div className="flex flex-col gap-5">
          <UsageMeter
            label="Messages this month"
            used={data.messageCount}
            limit={data.messageLimit}
          />
          <UsageMeter
            label="Documents"
            used={data.documentCount}
            limit={data.documentLimit}
          />
          <UsageMeter
            label="Workspaces"
            used={data.workspaceCount}
            limit={data.workspaceLimit}
          />
        </div>
        <p className="mt-5 text-[12px] text-[var(--color-ink-tertiary)]">
          Resets {data.messageResetAt}
        </p>
      </section>

      {/* Danger */}
      {showDanger && (
        <section className="rounded-[12px] border border-[#ef4444]/30 bg-[var(--color-surface-1)] p-6">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.4px] text-[#ef4444]">
            Danger
          </p>
          <p className="mb-4 text-[14px] text-[var(--color-ink-subtle)]">
            Cancel your subscription through the Stripe customer portal. Access
            continues until the end of the billing period.
          </p>
          <button
            type="button"
            onClick={() => openPortal("cancel")}
            disabled={loading !== null}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-[8px] border border-[#ef4444]/30 bg-[#ef4444]/10 px-3.5 py-2 text-[14px] font-medium text-[#ef4444] transition-colors hover:bg-[#ef4444]/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading === "cancel" ? "Opening…" : "Cancel subscription"}
          </button>
        </section>
      )}
    </div>
  );
}
