import { useState } from "react";
import { CSVUploader } from "./components/CSVUploader";
import { DataPreview } from "./components/DataPreview";
import { CorrelationHeatmap } from "./components/CorrelationHeatmap";
import type { ParsedDataset, DatasetMeta, MatrixEntry } from "./types/dataset";
import { computeCorrelationMatrix } from "./lib/pearson";

function App() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [matrix, setMatrix] = useState<MatrixEntry[] | null>(null);

  function handleDatasetLoaded(d: ParsedDataset, m: DatasetMeta) {
    setDataset(d);
    setMeta(m);
    setMatrix(computeCorrelationMatrix(d.numericRows, d.numericColumns));
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Correlation Analyst</h1>
      <CSVUploader onDatasetLoaded={handleDatasetLoaded} />
      {dataset && meta && <DataPreview dataset={dataset} meta={meta} />}
      {matrix && dataset && (
        <CorrelationHeatmap
          matrix={matrix}
          numericColumns={dataset.numericColumns}
          numericRows={dataset.numericRows}
        />
      )}
    </div>
  );
}

export default App;