/**
 * Auth constants shared by the server actions and the client forms.
 *
 * Kept out of `actions.ts` deliberately: a "use server" module may only export
 * async functions, so a constant or a type exported there is a build error.
 */

export const TERMS_DOC_VERSION = "2026-01-01";

export type AuthState = {
  error?: string;
  success?: string;
  fields?: { email?: string; fullName?: string };
};
