import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
} & Omit<React.ComponentPropsWithoutRef<"button">, "className">;

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-white hover:bg-foreground-hover border border-transparent shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-foreground hover:bg-surface",
};

const SIZE_MAP: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-xs tracking-wide",
  md: "h-11 px-6 text-sm tracking-wide",
  lg: "h-12 px-8 text-base tracking-wide",
};

const BASE =
  "inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT_MAP[variant]} ${SIZE_MAP[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}