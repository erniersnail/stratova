import { CONTENT_WIDTHS } from "@/lib/layout";

type ContainerSize = keyof typeof CONTENT_WIDTHS;

type ContainerProps = {
  children: React.ReactNode;
  size?: ContainerSize;
  className?: string;
};

const SIZE_MAP: Record<ContainerSize, string> = {
  hero: "max-w-[760px]",
  narrow: "max-w-[900px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1400px]",
  reading: "max-w-[680px]",
};

export default function Container({
  children,
  size = "default",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-6 ${SIZE_MAP[size]} ${className}`}>
      {children}
    </div>
  );
}