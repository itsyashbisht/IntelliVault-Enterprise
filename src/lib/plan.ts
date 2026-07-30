export const PLAN_LIMITS = {
  free: {
    workspaces: 2,
    documents: 3,
    messagesPerMonth: 50,
  },
  pro: {
    workspaces: 10,
    documents: 50,
    messagesPerMonth: 1200,
  },
  team: {
    workspaces: 250,
    documents: 1500,
    messagesPerMonth: 10000,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: PlanType) {
  return PLAN_LIMITS[plan];
}
