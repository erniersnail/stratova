type PaperPadding = "none" | "sm" | "md" | "lg";

type PaperProps = {
  children: React.ReactNode;
  padding?: PaperPadding;
  hover?: boolean;
  className?: string;
};

const PADDING_MAP: Record<PaperPadding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export default function Paper({
  children,
  padding = "md",
  hover = false,
  className = "",
}: PaperProps) {
  return (
    <div
      className={`rounded-sm border border-border bg-surface ${PADDING_MAP[padding]} ${
        hover ? "transition-all duration-200 hover:border-foreground hover:shadow-sm" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}