import Input from "@/components/ui/Input";

/**
 * Auth form field with label, optional hint and inline error. Shared by the
 * signup and login forms so both read identically.
 */
type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
};

export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  minLength,
  required = false,
  disabled = false,
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1.5"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        disabled={disabled}
        className="disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary"
      />
    </div>
  );
}
