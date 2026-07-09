import { useRef, useState } from "react";
import { parseCSV } from "../lib/csvParser";
import type { ParsedDataset, DatasetMeta } from "../types/dataset";

interface Props {
    onDatasetLoaded: (dataset: ParsedDataset, meta: DatasetMeta) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
}

export function CSVUploader({ onDatasetLoaded, description, onDescriptionChange }: Props) {
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setError("");

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const dataset = parseCSV(text);

            if (dataset.numericColumns.length < 2) {
                setError(
                    "CSV must have at least two numeric columns to compute correlations."
                );
                return;
            }

            onDatasetLoaded(dataset, {
                description,
                fileName: file.name,
                rowCount: dataset.numericRows.length,
                numericColumnCount: dataset.numericColumns.length,
            });
        };
        reader.readAsText(file);
    }

    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h2>Upload Dataset</h2>
            <div style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="description">
                    Describe your dataset (helps the AI give better insights):
                </label>
                <br />
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="e.g. Housing prices in Ames, Iowa from 2006 to 2010"
                    style={{ width: "100%", marginTop: "0.25rem", padding: "0.4rem" }}
                />
            </div>
            <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleFile}
            />
            {fileName && <p>Loaded: {fileName}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}