import { SECTION_SPACING } from "@/lib/layout";

type SectionSpacing = keyof typeof SECTION_SPACING | "none";

type SectionTag = "section" | "div" | "article" | "aside" | "main" | "header" | "footer";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: SectionSpacing;
  as?: SectionTag;
};

const SPACING_MAP: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
  xl: "py-40",
};

export default function Section({
  children,
  className = "",
  id,
  spacing = "md",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={`${SPACING_MAP[spacing]} ${className}`}>
      {children}
    </Tag>
  );
}