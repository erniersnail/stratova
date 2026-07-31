import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group">
      <span className="text-lg font-semibold tracking-wide text-foreground transition-colors duration-200 group-hover:text-secondary">
        STRATOVA
      </span>
      <span className="hidden sm:inline-block ml-2 text-[11px] font-medium tracking-[0.2em] text-tertiary uppercase">
        Quant
      </span>
    </Link>
  );
}