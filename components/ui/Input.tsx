type InputProps = {
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"input">, "className" | "id">;

export default function Input({
  id,
  placeholder,
  type = "text",
  required = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className={`h-11 rounded-sm border border-border bg-surface px-4 text-sm text-foreground placeholder:text-tertiary transition-colors duration-200 focus:border-foreground focus:outline-none ${className}`}
      {...props}
    />
  );
}