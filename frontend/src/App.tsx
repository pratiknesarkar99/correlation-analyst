import { useState } from "react";
import { CSVUploader } from "./components/CSVUploader";
import { DataPreview } from "./components/DataPreview";
import { CorrelationHeatmap } from "./components/CorrelationHeatmap";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { Stepper } from "./components/Stepper";
import type { ParsedDataset, DatasetMeta, MatrixEntry } from "./types/dataset";
import { computeCorrelationMatrix } from "./lib/pearson";

const STEPS = [
  { label: "Upload dataset" },
  { label: "Preview data" },
  { label: "Explore correlations" },
  { label: "AI interpretation" },
];

function App() {
  const [step, setStep] = useState(0);
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [matrix, setMatrix] = useState<MatrixEntry[] | null>(null);
  const [description, setDescription] = useState("");

  function handleDatasetLoaded(d: ParsedDataset, m: DatasetMeta) {
    setDataset(d);
    setMeta(m);
    setMatrix(computeCorrelationMatrix(d.numericRows, d.numericColumns));
  }

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  const canAdvanceStep0 = dataset !== null;

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#F8FAFC",
      overflow: "hidden",
    }}>
      {/* Header */}
      <header style={{
        background: "#0F172A",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        height: "56px",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            color: "#F8FAFC",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}>
            Correlation Analyst
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.72rem" }}>
            Upload a dataset, explore correlations, get AI-powered statistical insights
          </p>
        </div>
      </header>

      {/* Stepper */}
      <div style={{ flexShrink: 0 }}>
        <Stepper steps={STEPS} current={step} />
      </div>

      {/* Step content */}
      <main style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
      }}>
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Scrollable content area */}
          <div style={{
            flex: 1,
            overflow: "hidden",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}>
            {step === 0 && (
              <CSVUploader
                onDatasetLoaded={handleDatasetLoaded}
                description={description}
                onDescriptionChange={setDescription}
              />
            )}
            {step === 1 && dataset && meta && (
              <DataPreview dataset={dataset} meta={meta} />
            )}
            {step === 2 && matrix && dataset && (
              <CorrelationHeatmap
                matrix={matrix}
                numericColumns={dataset.numericColumns}
                numericRows={dataset.numericRows}
              />
            )}
            {step === 3 && matrix && (
              <AnalysisPanel
                matrix={matrix}
                description={description}
              />
            )}
          </div>

          {/* Navigation footer */}
          <div style={{
            borderTop: "1px solid #E2E8F0",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            background: "#FAFAFA",
            borderRadius: "0 0 12px 12px",
          }}>
            <button
              onClick={back}
              disabled={step === 0}
              style={{
                padding: "0.55rem 1.25rem",
                background: "transparent",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                cursor: step === 0 ? "not-allowed" : "pointer",
                fontSize: "0.825rem",
                fontWeight: 500,
                color: step === 0 ? "#CBD5E1" : "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Back
            </button>

            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Step {step + 1} of {STEPS.length}
            </span>

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={step === 0 && !canAdvanceStep0}
                style={{
                  padding: "0.55rem 1.25rem",
                  background: (step === 0 && !canAdvanceStep0) ? "#E2E8F0" : "#2563EB",
                  border: "none",
                  borderRadius: "6px",
                  cursor: (step === 0 && !canAdvanceStep0) ? "not-allowed" : "pointer",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: (step === 0 && !canAdvanceStep0) ? "#94A3B8" : "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Next
              </button>
            ) : (
              <div style={{ width: "80px" }} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;