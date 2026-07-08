import type { ParsedDataset, DatasetMeta } from "../types/dataset";

interface Props {
    dataset: ParsedDataset;
    meta: DatasetMeta;
}

export function DataPreview({ dataset, meta }: Props) {
    const previewRows = dataset.numericRows.slice(0, 5);

    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h2>Data Preview</h2>
            <p>
                {meta.rowCount} rows, {meta.numericColumnCount} numeric columns
                detected. Non-numeric columns have been excluded.
            </p>
            <p style={{ color: "#666", fontSize: "0.85rem" }}>
                Showing first 5 rows of numeric columns only.
            </p>
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.9rem" }}
                >
                    <thead>
                        <tr>
                            {dataset.numericColumns.map((col) => (
                                <th
                                    key={col}
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "0.4rem 0.75rem",
                                        background: "#f4f4f4",
                                        textAlign: "left",
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {previewRows.map((row, i) => (
                            <tr key={i}>
                                {dataset.numericColumns.map((col) => (
                                    <td
                                        key={col}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "0.4rem 0.75rem",
                                        }}
                                    >
                                        {row[col]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}