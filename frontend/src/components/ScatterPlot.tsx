import type { MatrixEntry } from "../types/dataset";

interface Props {
    entry: MatrixEntry;
    rows: Record<string, number>[];
}

export function ScatterPlot({ entry, rows }: Props) {
    const width = 400;
    const height = 300;
    const padding = 50;

    const xValues = rows.map((r) => r[entry.colA]);
    const yValues = rows.map((r) => r[entry.colB]);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    function scaleX(val: number): number {
        return padding + ((val - xMin) / (xMax - xMin)) * (width - padding * 2);
    }

    function scaleY(val: number): number {
        return (
            height -
            padding -
            ((val - yMin) / (yMax - yMin)) * (height - padding * 2)
        );
    }

    return (
        <div style={{ marginTop: "1rem" }}>
            <h3>
                {entry.colA} vs {entry.colB}
            </h3>
            <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
                {/* Axes */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="#999"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="#999"
                />

                {/* Axis labels */}
                <text
                    x={width / 2}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#666"
                >
                    {entry.colA}
                </text>
                <text
                    x={12}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#666"
                    transform={`rotate(-90, 12, ${height / 2})`}
                >
                    {entry.colB}
                </text>

                {/* Data points */}
                {xValues.map((x, i) => (
                    <circle
                        key={i}
                        cx={scaleX(x)}
                        cy={scaleY(yValues[i])}
                        r={3}
                        fill="steelblue"
                        opacity={0.6}
                    />
                ))}
            </svg>
            <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.5rem" }}>
                r = {entry.r.toFixed(4)} | n = {entry.n} | Mean {entry.colA}:{" "}
                {entry.xMean.toFixed(2)}, Mean {entry.colB}: {entry.yMean.toFixed(2)}
            </p>
        </div>
    );
}