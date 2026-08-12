/**
 * Public Supabase configuration.
 *
 * These two values are safe to publish. The publishable key is designed by
 * Supabase to be readable by every visitor — it is already compiled into the
 * JavaScript this site serves — and row-level security, not secrecy, is what
 * protects the data. Anonymous callers can read published news and projects
 * and insert an enquiry or a sign-up, and nothing else.
 *
 * They live here as well as in environment variables because the Netlify
 * project is owned by a team whose settings we cannot edit, and a build with
 * no configuration ships a site that looks healthy but has no backend.
 *
 * Environment variables still win when they are set, so a future deploy can
 * override these without touching the code.
 *
 * NEVER add the service-role key or the Resend key to this file. Those bypass
 * row-level security and send mail; they are Edge Function secrets and must
 * never reach the browser.
 */
export const PUBLIC_SUPABASE_URL = 'https://vusbutgfaivhodtztsxm.supabase.co'
export const PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_VxELdUZlkW4X4lrj1Ja5gA_UgRhE7LM'
