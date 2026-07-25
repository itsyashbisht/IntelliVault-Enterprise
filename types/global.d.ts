export {};

export type Roles = "admin" | "viewer" | "editor";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
