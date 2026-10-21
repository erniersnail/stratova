import SectionHeader from "@/components/common/SectionHeader";

export default function ContactInformation() {
  return (
    <div>
      <SectionHeader
        label="CONTACT"
        title="Contact Information"
        description="Reach out to the right team for your inquiry."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold mb-2">Founder</h3>
          <p className="text-secondary mb-4 text-sm">Siddharth Kumar, Founder &amp; Research Analyst</p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-secondary">Email:</span>{" "}
              <a href="mailto:siddharth@simplicialcapital.com" className="hover:text-accent">siddharth@simplicialcapital.com</a>
            </p>
            <p>
              <span className="text-secondary">Phone:</span>{" "}
              <a href="tel:+919019521998" className="hover:text-accent">+91 90195 21998</a>
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold mb-2">Business Inquiry</h3>
          <p className="text-secondary mb-4 text-sm">For general business inquiries and partnership discussions.</p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-secondary">Email:</span>{" "}
              <a href="mailto:business@simplicialcapital.com" className="hover:text-accent">business@simplicialcapital.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
