type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  className?: string;
};

export default function Pagination({
  currentPage = 1,
  totalPages = 3,
  className = "",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <span className="rounded-sm border border-border px-3.5 py-2 text-xs font-medium text-tertiary transition-colors duration-200 hover:border-foreground hover:text-foreground cursor-pointer">
        Previous
      </span>
      {pages.map((page) => (
        <span
          key={page}
          className={`rounded-sm border px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
            page === currentPage
              ? "border-foreground bg-foreground text-white"
              : "border-border text-secondary hover:border-foreground hover:text-foreground cursor-pointer"
          }`}
        >
          {page}
        </span>
      ))}
      <span className="rounded-sm border border-border px-3.5 py-2 text-xs font-medium text-secondary transition-colors duration-200 hover:border-foreground hover:text-foreground cursor-pointer">
        Next
      </span>
    </nav>
  );
}