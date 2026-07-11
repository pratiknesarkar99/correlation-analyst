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
                setError("CSV must have at least two numeric columns to compute correlations.");
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
        <div>
            <h2 style={headingStyle}>Upload your dataset</h2>
            <p style={subStyle}>
                Upload a CSV file and describe your data so the AI can provide relevant insights.
            </p>

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                    <label style={labelStyle}>
                        Dataset description
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder="e.g. Housing prices in Ames, Iowa from 2006 to 2010"
                        style={inputStyle}
                    />
                    <p style={hintStyle}>Helps the AI interpret correlations in the right domain context.</p>
                </div>

                <div>
                    <label style={labelStyle}>CSV file</label>
                    <div
                        onClick={() => fileRef.current?.click()}
                        style={{
                            border: "2px dashed #CBD5E1",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "border-color 0.15s",
                            background: fileName ? "#F0FDF4" : "#F8FAFC",
                            borderColor: fileName ? "#86EFAC" : "#CBD5E1",
                        }}
                    >
                        <p style={{ fontSize: "0.9rem", color: fileName ? "#166534" : "#64748B", fontWeight: 500 }}>
                            {fileName ? `Loaded: ${fileName}` : "Click to select a CSV file"}
                        </p>
                        {!fileName && (
                            <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                                Numeric columns will be extracted automatically
                            </p>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFile}
                        style={{ display: "none" }}
                    />
                </div>

                {error && (
                    <div style={{
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: "6px",
                        padding: "0.75rem 1rem",
                        fontSize: "0.85rem",
                        color: "#991B1B",
                    }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

const headingStyle: React.CSSProperties = {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.01em",
};

const subStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "#64748B",
    marginTop: "0.3rem",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.85rem",
    border: "1px solid #CBD5E1",
    borderRadius: "6px",
    fontSize: "0.875rem",
    color: "#0F172A",
    background: "#FFFFFF",
    outline: "none",
};

const hintStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: "#94A3B8",
    marginTop: "0.35rem",
};