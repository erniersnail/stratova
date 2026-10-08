"use client";

type ConfirmActionFormProps = {
  action: (id: string) => Promise<void>;
  id: string;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Form wrapper for destructive server actions: native confirm() on submit,
 * aborts if declined. Kept as a client component because server components
 * cannot attach event handlers.
 */
export default function ConfirmActionForm({
  action,
  id,
  confirmMessage,
  children,
  className = "",
}: ConfirmActionFormProps) {
  const bound = action.bind(null, id);

  return (
    <form
      action={bound}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
