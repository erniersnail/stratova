import Container from "@/components/layout/Container";

/**
 * Generic page skeleton shown while a slow server route resolves.
 * Rendered by every route-level loading.tsx. Sizing roughly matches the
 * real page so layout does not shift when content arrives.
 */
export default function PageLoading() {
  return (
    <main>
      <Container className="py-20">
        <div className="h-10 w-56 animate-pulse rounded bg-surface-hover" />
        <div className="mt-4 h-5 w-80 animate-pulse rounded bg-surface-hover" />
        <div className="mt-12 h-72 w-full animate-pulse rounded bg-surface-hover" />
      </Container>
    </main>
  );
}