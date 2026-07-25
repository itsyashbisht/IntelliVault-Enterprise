import { pgEnum } from "drizzle-orm/pg-core";
import { workspaceMembers } from "./workspaceMember";

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "editor",
  "viewer",
]);

export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "expired",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "processing",
  "ready",
  "failed",
]);

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);
export type Role = (typeof workspaceMembers.$inferSelect)["role"];
