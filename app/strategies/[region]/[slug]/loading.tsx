export default function PageLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="h-6 w-24 rounded-full bg-surface-hover" />
        <div className="h-6 w-48 rounded-full bg-surface-hover" />
        <div className="h-6 w-32 rounded-full bg-surface-hover" />
      </div>
    </div>
  );
}