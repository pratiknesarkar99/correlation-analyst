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
        <div>
            <h2 style={headingStyle}>AI interpretation</h2>
            <p style={subStyle}>
                The AI analyst will explain what these correlations mean in the context of your dataset.
                All statistics are computed by the Pearson engine, the AI only provides natural language reasoning.
            </p>

            <div style={{ marginTop: "1.5rem" }}>
                {!description.trim() && (
                    <div style={{
                        background: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        borderRadius: "6px",
                        padding: "0.75rem 1rem",
                        fontSize: "0.825rem",
                        color: "#92400E",
                        marginBottom: "1rem",
                    }}>
                        Add a dataset description in Step 1 to enable AI analysis.
                    </div>
                )}

                <button
                    onClick={handleRun}
                    disabled={!canRun}
                    style={{
                        padding: "0.65rem 1.75rem",
                        background: canRun ? "#2563EB" : "#E2E8F0",
                        color: canRun ? "#FFFFFF" : "#94A3B8",
                        border: "none",
                        borderRadius: "6px",
                        cursor: canRun ? "pointer" : "not-allowed",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                        transition: "background 0.15s",
                    }}
                >
                    {isLoading ? "Analyzing..." : "Run AI analysis"}
                </button>

                {error && (
                    <div style={{
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: "6px",
                        padding: "0.75rem 1rem",
                        fontSize: "0.825rem",
                        color: "#991B1B",
                        marginTop: "1rem",
                    }}>
                        {error}
                    </div>
                )}

                {(interpretation || isLoading) && (
                    <div style={{
                        marginTop: "1.25rem",
                        padding: "1.5rem",
                        background: "#F8FAFC",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        lineHeight: "1.75",
                        fontSize: "0.9rem",
                        color: "#1E293B",
                        whiteSpace: "pre-wrap",
                        minHeight: "120px",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {interpretation}
                        {isLoading && (
                            <span style={{
                                display: "inline-block",
                                width: "2px",
                                height: "14px",
                                background: "#2563EB",
                                marginLeft: "2px",
                                verticalAlign: "text-bottom",
                                animation: "blink 1s step-end infinite",
                            }} />
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
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