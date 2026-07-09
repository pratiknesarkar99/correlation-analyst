import { useState } from "react";
import type { MatrixEntry } from "../types/dataset";
import { rToColor, interpretR } from "../lib/colorScale";
import { ScatterPlot } from "./ScatterPlot";

interface Props {
    matrix: MatrixEntry[];
    numericColumns: string[];
    numericRows: Record<string, number>[];
}

export function CorrelationHeatmap({ matrix, numericColumns, numericRows }: Props) {
    const [selected, setSelected] = useState<MatrixEntry | null>(null);

    function getEntry(colA: string, colB: string): MatrixEntry | undefined {
        return matrix.find(
            (e) =>
                (e.colA === colA && e.colB === colB) ||
                (e.colA === colB && e.colB === colA)
        );
    }

    const cellSize = 80;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2>Correlation Matrix</h2>
            <p style={{ fontSize: "0.85rem", color: "#555" }}>
                Green = positive correlation, Red = negative correlation. Click any
                cell to see the scatter plot.
            </p>

            {/* Heatmap grid */}
            <div style={{ overflowX: "auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `120px repeat(${numericColumns.length}, ${cellSize}px)`,
                        gap: "2px",
                        width: "fit-content",
                    }}
                >
                    {/* Top-left empty cell */}
                    <div />

                    {/* Column headers */}
                    {numericColumns.map((col) => (
                        <div
                            key={col}
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: "0.25rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            title={col}
                        >
                            {col}
                        </div>
                    ))}

                    {/* Rows */}
                    {numericColumns.map((rowCol) => (
                        <>
                            {/* Row label */}
                            <div
                                key={`label-${rowCol}`}
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "0.5rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                title={rowCol}
                            >
                                {rowCol}
                            </div>

                            {/* Cells */}
                            {numericColumns.map((colCol) => {
                                if (rowCol === colCol) {
                                    return (
                                        <div
                                            key={`${rowCol}-${colCol}`}
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                background: "#e8e8e8",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.75rem",
                                                color: "#999",
                                            }}
                                        >
                                            1.00
                                        </div>
                                    );
                                }

                                const entry = getEntry(rowCol, colCol);
                                if (!entry) return <div key={`${rowCol}-${colCol}`} />;

                                const isSelected =
                                    selected?.colA === entry.colA &&
                                    selected?.colB === entry.colB;

                                return (
                                    <div
                                        key={`${rowCol}-${colCol}`}
                                        onClick={() =>
                                            setSelected(isSelected ? null : entry)
                                        }
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            background: rToColor(entry.r),
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: isSelected ? "2px solid #333" : "2px solid transparent",
                                            borderRadius: "3px",
                                        }}
                                        title={`${entry.colA} vs ${entry.colB}: r = ${entry.r.toFixed(4)}`}
                                    >
                                        <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                                            {entry.r.toFixed(2)}
                                        </span>
                                        <span style={{ fontSize: "0.65rem", color: "#444" }}>
                                            {interpretR(entry.r)}
                                        </span>
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

            {/* Scatter plot panel */}
            {selected && (
                <ScatterPlot
                    entry={selected}
                    rows={numericRows}
                />
            )}
        </div>
    );
}