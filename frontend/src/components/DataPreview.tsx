import type { ParsedDataset, DatasetMeta } from "../types/dataset";

interface Props {
    dataset: ParsedDataset;
    meta: DatasetMeta;
}

export function DataPreview({ dataset, meta }: Props) {
    const previewRows = dataset.numericRows.slice(0, 5);

    return (
        <div>
            <span style={eyebrowStyle}>Step 2</span>
            <h2 style={headingStyle}>Data preview</h2>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", marginBottom: "1.25rem" }}>
                <Stat label="Rows" value={meta.rowCount.toLocaleString()} />
                <Stat label="Numeric columns" value={meta.numericColumnCount} />
                <Stat label="Excluded columns" value={dataset.allColumns.length - meta.numericColumnCount} />
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: "0.825rem",
                }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                            {dataset.numericColumns.map((col) => (
                                <th key={col} style={{
                                    padding: "0.6rem 1rem",
                                    textAlign: "left",
                                    fontWeight: 600,
                                    color: "#374151",
                                    whiteSpace: "nowrap",
                                }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {previewRows.map((row, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                {dataset.numericColumns.map((col) => (
                                    <td key={col} style={{
                                        padding: "0.6rem 1rem",
                                        color: "#0F172A",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.8rem",
                                    }}>
                                        {row[col]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.75rem" }}>
                Showing first 5 rows. Non-numeric columns have been excluded from analysis.
            </p>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number | string }) {
    return (
        <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
        }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>{value}</p>
            <p style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "0.1rem" }}>{label}</p>
        </div>
    );
}

const eyebrowStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#2563EB",
    display: "block",
    marginBottom: "0.4rem",
};

const headingStyle: React.CSSProperties = {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.01em",
};