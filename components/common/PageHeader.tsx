import { typography } from "@/lib/typography";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export default function PageHeader({
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`max-w-[620px] ${className}`}>
      <h1 className={typography.h1}>{title}</h1>
      {description && (
        <p className={`${typography.body} mt-5 text-secondary`}>
          {description}
        </p>
      )}
    </div>
  );
}