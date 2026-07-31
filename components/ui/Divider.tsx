type DividerSpacing = "sm" | "md" | "lg" | "none";

type DividerProps = {
  spacing?: DividerSpacing;
  className?: string;
};

const SPACING_MAP: Record<DividerSpacing, string> = {
  none: "my-0",
  sm: "my-8",
  md: "my-12",
  lg: "my-16",
};

export default function Divider({ spacing = "md", className = "" }: DividerProps) {
  return <hr className={`border-t border-border ${SPACING_MAP[spacing]} ${className}`} />;
}