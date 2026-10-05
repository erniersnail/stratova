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
 * ⚠️ PENDING — this is a placeholder, NOT a real registration number.
 * Stratova Quant's RA registration is in progress. Replace the string below
 * with the issued number BEFORE setting PUBLIC_MODE to "true". Never launch
 * with the placeholder in place.
 */
export const RA_REGISTRATION_NUMBER = "RA-XXXXXX — pending";

/**
 * Public mode gate.
 *
 * Defaults to pre-launch when NEXT_PUBLIC_PUBLIC_MODE is unset or anything
 * other than the exact string "true". Failing closed is deliberate: a missing
 * or misconfigured variable must never accidentally expose the site publicly.
 *
 * Set NEXT_PUBLIC_PUBLIC_MODE="true" to launch.
 */
export const IS_PUBLIC_MODE = process.env.NEXT_PUBLIC_PUBLIC_MODE === "true";

/** True when the site is pre-launch and must not be publicly distributed. */
export const IS_PRE_LAUNCH = !IS_PUBLIC_MODE;
