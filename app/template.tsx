/**
 * Route-level template. Unlike layout.tsx, template.tsx re-mounts on every
 * navigation, so a CSS animation on this wrapper plays once per page change.
 * Navbar and Footer live in layout.tsx and stay mounted — only the page
 * content crossfades.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade-in">{children}</div>;
}
