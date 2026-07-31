import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Divider from "@/components/ui/Divider";
import ContactForm from "@/components/contact/ContactForm";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactFAQ from "@/components/contact/ContactFAQ";

export const metadata = {
  title: "Contact — Stratova Quant",
  description: "Contact Stratova Quant for research inquiries, business development, media requests, and general questions.",
};

export default function ContactPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Contact" description="Contact Stratova Quant for research inquiries, business development, media requests, and general questions." />
      </Container>

      <Section spacing="lg">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ContactForm />
            <ContactInformation />
          </div>
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="narrow">
          <h2 className="text-2xl font-semibold tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="mt-8"><ContactFAQ /></div>
        </Container>
      </Section>
    </main>
  );
}