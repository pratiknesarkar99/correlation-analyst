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

    const top3Pairs = [...matrix]
        .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
        .slice(0, 3)
        .map((e) => `${e.colA}|${e.colB}`);

    function isTopPair(entry: MatrixEntry): boolean {
        return (
            top3Pairs.includes(`${entry.colA}|${entry.colB}`) ||
            top3Pairs.includes(`${entry.colB}|${entry.colA}`)
        );
    }

    const cellSize = 80;

    return (
        <div style={{ display: "flex", gap: "2rem", height: "100%", minHeight: 0 }}>

            {/* Left column: heatmap */}
            <div style={{
                flex: "0 0 auto",
                overflowY: "auto",
                overflowX: "auto",
            }}>
                <h2 style={headingStyle}>Correlation matrix</h2>
                <p style={subStyle}>Click any cell to see its scatter plot.</p>

                <div style={{ marginTop: "1.25rem" }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: `120px repeat(${numericColumns.length}, ${cellSize}px)`,
                        gap: "3px",
                        width: "fit-content",
                    }}>
                        <div />
                        {numericColumns.map((col) => (
                            <div key={col} style={{
                                fontSize: "0.68rem",
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
                                    fontSize: "0.68rem",
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

                                    const isTop = isTopPair(entry);

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
                                                border: isSelected
                                                    ? "2px solid #2563EB"
                                                    : isTop
                                                        ? "2px solid #F59E0B"
                                                        : "2px solid transparent",
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                            title={`${entry.colA} vs ${entry.colB}: r = ${entry.r.toFixed(4)}`}
                                        >
                                            <span style={{
                                                fontSize: "0.82rem",
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

                                            {/* Top pair dot */}
                                            {isTop && !isSelected && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: "4px",
                                                    right: "4px",
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    background: "#F59E0B",
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        ))}
                    </div>

                    {/* Legend */}
                    <p style={{
                        fontSize: "0.72rem",
                        color: "#94A3B8",
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                    }}>
                        <span style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#F59E0B",
                            flexShrink: 0,
                        }} />
                        Amber border and dot indicate the 3 strongest correlations in the dataset.
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div style={{
                width: "1px",
                background: "#E2E8F0",
                flexShrink: 0,
                alignSelf: "stretch",
            }} />

            {/* Right column: scatter plot */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: selected ? "flex-start" : "center",
                alignItems: selected ? "flex-start" : "center",
            }}>
                {selected ? (
                    <ScatterPlot entry={selected} rows={numericRows} />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "#F1F5F9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1rem",
                            fontSize: "1.5rem",
                        }}>
                            ↖
                        </div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                            No pair selected
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                            Click any cell in the matrix to see its scatter plot here.
                        </p>
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