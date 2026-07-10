import type { MatrixEntry } from "../types/dataset";

interface Props {
    entry: MatrixEntry;
    rows: Record<string, number>[];
}

export function ScatterPlot({ entry, rows }: Props) {
    const width = 460;
    const height = 320;
    const padding = { top: 20, right: 20, bottom: 50, left: 55 };

    const xValues = rows.map((r) => r[entry.colA]);
    const yValues = rows.map((r) => r[entry.colB]);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    function scaleX(val: number): number {
        return padding.left + ((val - xMin) / (xMax - xMin)) * plotW;
    }

    function scaleY(val: number): number {
        return padding.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;
    }

    const xTicks = 5;
    const yTicks = 5;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {entry.colA} vs {entry.colB}
                </h3>
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.8rem",
                    color: entry.r > 0 ? "#1D4ED8" : "#DC2626",
                    fontWeight: 500,
                }}>
                    r = {entry.r.toFixed(4)}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                    n = {entry.n}
                </span>
            </div>

            <svg width={width} height={height}>
                {/* Grid lines */}
                {Array.from({ length: yTicks }).map((_, i) => {
                    const y = padding.top + (i / (yTicks - 1)) * plotH;
                    return (
                        <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y}
                            stroke="#F1F5F9" strokeWidth={1} />
                    );
                })}

                {/* Axes */}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom}
                    stroke="#CBD5E1" strokeWidth={1} />
                <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom}
                    stroke="#CBD5E1" strokeWidth={1} />

                {/* X axis ticks and labels */}
                {Array.from({ length: xTicks }).map((_, i) => {
                    const val = xMin + (i / (xTicks - 1)) * (xMax - xMin);
                    const x = scaleX(val);
                    return (
                        <g key={i}>
                            <line x1={x} y1={height - padding.bottom} x2={x} y2={height - padding.bottom + 4}
                                stroke="#CBD5E1" strokeWidth={1} />
                            <text x={x} y={height - padding.bottom + 16} textAnchor="middle"
                                fontSize={10} fill="#94A3B8" fontFamily="Inter, sans-serif">
                                {Number.isInteger(val) ? val : val.toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                {/* Y axis ticks and labels */}
                {Array.from({ length: yTicks }).map((_, i) => {
                    const val = yMin + ((yTicks - 1 - i) / (yTicks - 1)) * (yMax - yMin);
                    const y = padding.top + (i / (yTicks - 1)) * plotH;
                    return (
                        <g key={i}>
                            <line x1={padding.left - 4} y1={y} x2={padding.left} y2={y}
                                stroke="#CBD5E1" strokeWidth={1} />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end"
                                fontSize={10} fill="#94A3B8" fontFamily="Inter, sans-serif">
                                {Number.isInteger(val) ? val : val.toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                {/* Axis labels */}
                <text x={padding.left + plotW / 2} y={height - 6} textAnchor="middle"
                    fontSize={11} fill="#64748B" fontWeight={500} fontFamily="Inter, sans-serif">
                    {entry.colA}
                </text>
                <text x={14} y={padding.top + plotH / 2} textAnchor="middle"
                    fontSize={11} fill="#64748B" fontWeight={500} fontFamily="Inter, sans-serif"
                    transform={`rotate(-90, 14, ${padding.top + plotH / 2})`}>
                    {entry.colB}
                </text>

                {/* Data points */}
                {xValues.map((x, i) => (
                    <circle
                        key={i}
                        cx={scaleX(x)}
                        cy={scaleY(yValues[i])}
                        r={3}
                        fill={entry.r > 0 ? "#3B82F6" : "#EF4444"}
                        opacity={0.45}
                    />
                ))}
            </svg>

            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
                <StatPill label={`Mean ${entry.colA}`} value={entry.xMean.toFixed(3)} />
                <StatPill label={`Mean ${entry.colB}`} value={entry.yMean.toFixed(3)} />
                <StatPill label={`StdDev ${entry.colA}`} value={entry.xStdDev.toFixed(3)} />
                <StatPill label={`StdDev ${entry.colB}`} value={entry.yStdDev.toFixed(3)} />
            </div>
        </div>
    );
}

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 500 }}>{label}</p>
            <p style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#0F172A",
                fontFamily: "'JetBrains Mono', monospace",
            }}>{value}</p>
        </div>
    );
}