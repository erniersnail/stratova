import { typography } from "@/lib/typography";

type SectionHeaderProps = {
  label: string;
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
      <span className="text-[13px] font-medium tracking-[0.15em] text-secondary uppercase">
        {label}
      </span>
      <h2 className={`${typography.h2} mt-5`}>{title}</h2>
      {description && (
        <p
          className={`${typography.body} mx-auto mt-5 max-w-[620px] text-secondary`}
        >
          {description}
        </p>
      )}
    </div>
  );
}