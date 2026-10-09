import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { markPaymentPaid } from "@/lib/admin/markPaid";
import {
  getPendingPayments,
  getRecentPaidPayments,
  type PendingPayment,
} from "@/lib/admin/payments";
import { formatIST } from "@/lib/format/date";

export const metadata: Metadata = {
  title: "Payments — Admin",
};

async function requireAdminInPage(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") notFound();
}

function refId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function amountLabel(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function TableHead() {
  return (
    <thead>
      <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-tertiary">
        <th className="px-4 py-3 font-medium">Date</th>
        <th className="px-4 py-3 font-medium">Client</th>
        <th className="px-4 py-3 font-medium">Strategy</th>
        <th className="px-4 py-3 font-medium">Amount</th>
        <th className="px-4 py-3 font-medium">Ref Id</th>
      </tr>
    </thead>
  );
}

function PendingRow({ payment }: { payment: PendingPayment }) {
  const action = markPaymentPaid.bind(null, payment.id);
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3 text-sm text-secondary">
        {formatIST(payment.created_at)}
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{payment.client_email}</td>
      <td className="px-4 py-3 text-sm text-foreground">{payment.strategy_name}</td>
      <td className="px-4 py-3 text-sm text-foreground">{amountLabel(payment.amount)}</td>
      <td className="px-4 py-3 font-mono text-xs text-secondary">{refId(payment.id)}</td>
      <td className="px-4 py-3">
        <form action={action}>
          <button
            type="submit"
            className="text-sm text-foreground underline hover:no-underline"
          >
            Mark paid
          </button>
        </form>
      </td>
    </tr>
  );
}

function PaidRow({ payment }: { payment: PendingPayment }) {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3 text-sm text-secondary">
        {payment.paid_at ? formatIST(payment.paid_at) : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{payment.client_email}</td>
      <td className="px-4 py-3 text-sm text-foreground">{payment.strategy_name}</td>
      <td className="px-4 py-3 text-sm text-foreground">{amountLabel(payment.amount)}</td>
      <td className="px-4 py-3 font-mono text-xs text-secondary">{refId(payment.id)}</td>
    </tr>
  );
}

export default async function AdminPaymentsPage() {
  await requireAdminInPage();
  const [pending, recent] = await Promise.all([
    getPendingPayments(),
    getRecentPaidPayments(),
  ]);

  return (
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">Payments — Admin</h1>
        <Link
          href="/admin"
          className="mt-2 inline-block text-sm text-secondary underline hover:no-underline"
        >
          ← Admin
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Pending payments</h2>
        {pending.length === 0 ? (
          <p className="mt-4 border border-border bg-surface px-6 py-10 text-center text-sm text-secondary">
            No pending payments.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-border bg-surface">
            <table className="w-full text-left">
              <TableHead />
              <tbody>
                {pending.map((p) => (
                  <PendingRow key={p.id} payment={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">
          Recently paid (last 30)
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 border border-border bg-surface px-6 py-10 text-center text-sm text-secondary">
            No recent payments.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-border bg-surface">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-tertiary">
                  <th className="px-4 py-3 font-medium">Paid on</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Strategy</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Ref Id</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => (
                  <PaidRow key={p.id} payment={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Container>
  );
}
