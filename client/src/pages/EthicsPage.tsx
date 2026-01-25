import { EthicsCommitment } from "@/legal/EthicsCommitment";
import { SEO } from "@/components/SEO";

export default function EthicsPage() {
  return (
    <>
      <SEO
        title="Ethics | The Genuine Love Project"
        description="Our ethical commitments and values. Educational wellness tools for adults 18+."
      />
      <EthicsCommitment />
      <p className="text-center text-sm opacity-70 py-4">
        Adults 18+ only. Educational wellness tools, not medical care.
      </p>
    </>
  );
}