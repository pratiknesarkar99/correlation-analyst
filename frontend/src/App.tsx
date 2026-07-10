import { useState } from "react";
import { CSVUploader } from "./components/CSVUploader";
import { DataPreview } from "./components/DataPreview";
import { CorrelationHeatmap } from "./components/CorrelationHeatmap";
import { AnalysisPanel } from "./components/AnalysisPanel";
import type { ParsedDataset, DatasetMeta, MatrixEntry } from "./types/dataset";
import { computeCorrelationMatrix } from "./lib/pearson";

function App() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [matrix, setMatrix] = useState<MatrixEntry[] | null>(null);
  const [description, setDescription] = useState("");

  function handleDatasetLoaded(d: ParsedDataset, m: DatasetMeta) {
    setDataset(d);
    setMeta(m);
    setMatrix(computeCorrelationMatrix(d.numericRows, d.numericColumns));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Header */}
      <header style={{
        background: "#0F172A",
        padding: "1.25rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <div>
          <h1 style={{
            color: "#F8FAFC",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}>
            Correlation Analyst
          </h1>
          <p style={{
            color: "#94A3B8",
            fontSize: "0.8rem",
            marginTop: "0.1rem",
          }}>
            Upload a dataset, explore correlations, get AI-powered statistical insights
          </p>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}>
        <Section>
          <CSVUploader
            onDatasetLoaded={handleDatasetLoaded}
            description={description}
            onDescriptionChange={setDescription}
          />
        </Section>

        {dataset && meta && (
          <Section>
            <DataPreview dataset={dataset} meta={meta} />
          </Section>
        )}

        {matrix && dataset && (
          <>
            <Section>
              <CorrelationHeatmap
                matrix={matrix}
                numericColumns={dataset.numericColumns}
                numericRows={dataset.numericRows}
              />
            </Section>
            <Section>
              <AnalysisPanel
                matrix={matrix}
                description={description}
              />
            </Section>
          </>
        )}
      </main>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      padding: "2rem",
    }}>
      {children}
    </div>
  );
}

export default App;