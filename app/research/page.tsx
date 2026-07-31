import Container from "@/components/layout/Container";
import { RESEARCH_ITEMS } from "@/lib/research";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ResearchFilters from "@/components/research/ResearchFilters";
import ResearchGrid from "@/components/research/ResearchGrid";

export default function ResearchPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="Research"
          description="Browse research covering quantitative investing, factor models, portfolio construction, and market structure."
        />

        <div className="mt-10">
          <ResearchFilters />
        </div>

        <div className="mt-10">
          <ResearchGrid items={RESEARCH_ITEMS} />
        </div>

        <Pagination className="mt-14" />
      </Container>
    </main>
  );
}