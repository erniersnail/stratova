import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonProps = BaseProps & {
  href: string;
  type?: never;
  disabled?: never;
} | BaseProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:opacity-90 shadow-sm",
  secondary: "border border-border bg-transparent text-foreground hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled}
      className={classes}
    >
      {children}
    </button>
  );
}