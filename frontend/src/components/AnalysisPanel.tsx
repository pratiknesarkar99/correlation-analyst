import type { MatrixEntry } from "../types/dataset";
import { useAnalysis } from "../hooks/useAnalysis";

interface Props {
    matrix: MatrixEntry[];
    description: string;
}

export function AnalysisPanel({ matrix, description }: Props) {
    const { interpretation, isLoading, error, run } = useAnalysis();

    function handleRun() {
        if (!description.trim()) return;
        run({ description, matrix });
    }

    const canRun = description.trim().length > 0 && !isLoading;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2>AI Interpretation</h2>

            {!description.trim() && (
                <p style={{ color: "#999", fontSize: "0.85rem" }}>
                    Add a dataset description above to enable analysis.
                </p>
            )}

            <button
                onClick={handleRun}
                disabled={!canRun}
                style={{
                    padding: "0.6rem 1.5rem",
                    background: canRun ? "#2563eb" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: canRun ? "pointer" : "not-allowed",
                    fontSize: "0.95rem",
                }}
            >
                {isLoading ? "Analyzing..." : "Run AI Analysis"}
            </button>

            {error && (
                <p style={{ color: "red", marginTop: "0.75rem" }}>{error}</p>
            )}

            {(interpretation || isLoading) && (
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "1rem",
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0",
                        lineHeight: "1.7",
                        fontSize: "0.95rem",
                        whiteSpace: "pre-wrap",
                        minHeight: "100px",
                    }}
                >
                    {interpretation}
                    {isLoading && (
                        <span
                            style={{
                                display: "inline-block",
                                width: "8px",
                                height: "14px",
                                background: "#2563eb",
                                marginLeft: "2px",
                                animation: "blink 1s step-end infinite",
                            }}
                        />
                    )}
                </div>
            )}

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}