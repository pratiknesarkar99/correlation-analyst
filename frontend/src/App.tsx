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
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Correlation Analyst</h1>
      <CSVUploader
        onDatasetLoaded={handleDatasetLoaded}
        description={description}
        onDescriptionChange={setDescription}
      />
      {dataset && meta && <DataPreview dataset={dataset} meta={meta} />}
      {matrix && dataset && (
        <>
          <CorrelationHeatmap
            matrix={matrix}
            numericColumns={dataset.numericColumns}
            numericRows={dataset.numericRows}
          />
          <AnalysisPanel
            matrix={matrix}
            description={description}
          />
        </>
      )}
    </div>
  );
}

export default App;