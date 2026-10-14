import Input from "@/components/ui/Input";

/**
 * Auth form field with label, optional hint, optional right-aligned slot,
 * and inline error. Shared by the signup and login forms so both read
 * identically. `rightSlot` renders on the same row as the label, right-
 * aligned — used for e.g. "Forgot password?" next to the Email field.
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
  rightSlot?: React.ReactNode;
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
  rightSlot,
}: AuthFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {rightSlot}
      </div>
      <Input
        id={id}
        name={id}
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
