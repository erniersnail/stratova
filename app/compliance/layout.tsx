import Container from "@/components/layout/Container";
import ComplianceNav from "@/components/compliance/ComplianceNav";

export { COMPLIANCE_PAGES } from "@/lib/compliance";

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Container size="default" className="pt-12 pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ComplianceNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </main>
  );
}
