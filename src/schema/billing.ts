import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const planTypeEnum = pgEnum("plan_type", ["free", "pro", "team"]);

export const billing = pgTable("billing", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  plan: planTypeEnum("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  messageCount: integer("message_count").notNull().default(0),
  messageResetAt: timestamp("message_reset_at").notNull().defaultNow(),
  billingAnchorDay: integer("billing_anchor_day").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Billing = typeof billing.$inferSelect;
export type InsertBilling = typeof billing.$inferInsert;
