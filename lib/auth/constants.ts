/**
 * Auth constants shared by the server actions and the client forms.
 *
 * Kept out of `actions.ts` deliberately: a "use server" module may only export
 * async functions, so a constant or a type exported there is a build error.
 */

/** Document version recorded against a terms consent. Bump when the text changes. */
export const TERMS_DOC_VERSION = "v1";

export type AuthState = {
  error?: string;
  fields?: { email?: string; fullName?: string };
};
