import { useState } from "react";
import type { MatrixEntry } from "../types/dataset";
import { rToColor, rToTextColor, interpretR } from "../lib/colorScale";
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

    const cellSize = 88;

    return (
        <div>
            <span style={eyebrowStyle}>Step 3</span>
            <h2 style={headingStyle}>Correlation matrix</h2>
            <p style={subStyle}>
                Click any cell to see the scatter plot for that pair.
                Blue indicates positive correlation, red indicates negative.
            </p>

            <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: `130px repeat(${numericColumns.length}, ${cellSize}px)`,
                    gap: "3px",
                    width: "fit-content",
                }}>
                    <div />
                    {numericColumns.map((col) => (
                        <div key={col} style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: "#374151",
                            textAlign: "center",
                            padding: "0.25rem 0.1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }} title={col}>
                            {col}
                        </div>
                    ))}

                    {numericColumns.map((rowCol) => (
                        <>
                            <div key={`label-${rowCol}`} style={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: "#374151",
                                display: "flex",
                                alignItems: "center",
                                paddingRight: "0.5rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }} title={rowCol}>
                                {rowCol}
                            </div>

                            {numericColumns.map((colCol) => {
                                if (rowCol === colCol) {
                                    return (
                                        <div key={`${rowCol}-${colCol}`} style={{
                                            width: cellSize,
                                            height: cellSize,
                                            background: "#F1F5F9",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "4px",
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            color: "#94A3B8",
                                            fontFamily: "'JetBrains Mono', monospace",
                                        }}>
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
                                        onClick={() => setSelected(isSelected ? null : entry)}
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            background: rToColor(entry.r),
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                            border: isSelected ? "2px solid #2563EB" : "2px solid transparent",
                                            position: "relative",
                                            overflow: "hidden",
                                            transition: "transform 0.1s, box-shadow 0.1s",
                                        }}
                                        title={`${entry.colA} vs ${entry.colB}: r = ${entry.r.toFixed(4)}`}
                                    >
                                        <span style={{
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            color: rToTextColor(entry.r),
                                            fontFamily: "'JetBrains Mono', monospace",
                                        }}>
                                            {entry.r.toFixed(2)}
                                        </span>
                                        <span style={{
                                            fontSize: "0.6rem",
                                            color: "#475569",
                                            marginTop: "0.1rem",
                                            fontWeight: 500,
                                        }}>
                                            {interpretR(entry.r)}
                                        </span>
                                        {/* Intensity bar */}
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            height: "3px",
                                            width: `${Math.abs(entry.r) * 100}%`,
                                            background: entry.r > 0 ? "#3B82F6" : "#EF4444",
                                            borderRadius: "0 2px 0 0",
                                        }} />
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

            {selected && (
                <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #E2E8F0" }}>
                    <ScatterPlot entry={selected} rows={numericRows} />
                </div>
            )}
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

const subStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "#64748B",
    marginTop: "0.3rem",
};