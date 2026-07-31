type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-border px-2.5 py-1 text-xs font-medium tracking-wide text-secondary ${className}`}
    >
      {children}
    </span>
  );
}