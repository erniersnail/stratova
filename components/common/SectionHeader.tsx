import { typography } from "@/lib/typography";

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
};

export default function SectionHeader({
  label,
  title,
  description,
  className = "",
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {label && (
        <span className="text-sm font-semibold tracking-[0.15em] text-secondary uppercase">
          {label}
        </span>
      )}
      <h2 className={`${typography.h2} ${label ? "mt-5" : ""}`}>{title}</h2>
      {description && (
        <p
          className={`${typography.body} mt-4 max-w-[620px] text-secondary ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
