import { useState } from "react";
import { CSVUploader } from "./components/CSVUploader";
import { DataPreview } from "./components/DataPreview";
import type { ParsedDataset, DatasetMeta } from "./types/dataset";

function App() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);

  function handleDatasetLoaded(d: ParsedDataset, m: DatasetMeta) {
    setDataset(d);
    setMeta(m);
  }

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Correlation Analyst</h1>
      <CSVUploader onDatasetLoaded={handleDatasetLoaded} />
      {dataset && meta && <DataPreview dataset={dataset} meta={meta} />}
    </div>
  );
}

export default App;