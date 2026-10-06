/**
 * Central site configuration.
 *
 * This module is the single source of truth for launch state and regulatory
 * identifiers. It is read at build time only — no database, no network, no
 * request-time work.
 */

/**
 * SEBI Research Analyst registration number.
 *
 * Set to null while the only value we have is the placeholder below — callers
 * must skip rendering the registration line entirely when this is null.
 * Replace the placeholder with the issued number when it is available;
 * never render the placeholder itself.
 */
const RA_REGISTRATION_PLACEHOLDER = "RA-XXXXXX — pending";
export const RA_REGISTRATION_NUMBER: string | null =
  RA_REGISTRATION_PLACEHOLDER.includes("pending")
    ? null
    : RA_REGISTRATION_PLACEHOLDER;

/**
 * Public mode gate (hidden safety switch).
 *
 * Defaults to PUBLIC: any unset or unrecognized value means public mode.
 * Set NEXT_PUBLIC_PUBLIC_MODE="false" explicitly to fall back to the
 * lockdown mode (noindex, robots disallow-all, footer banner).
 */
export const IS_PUBLIC_MODE = process.env.NEXT_PUBLIC_PUBLIC_MODE !== "false";

/** True only when the safety switch is explicitly set to "false". */
export const IS_PRE_LAUNCH = !IS_PUBLIC_MODE;
