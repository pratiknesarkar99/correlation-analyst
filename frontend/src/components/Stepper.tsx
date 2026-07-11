interface Step {
    label: string;
}

interface Props {
    steps: Step[];
    current: number;
}

export function Stepper({ steps, current }: Props) {
    return (
        <div style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            height: "56px",
            gap: "0",
        }}>
            {steps.map((step, i) => {
                const isCompleted = i < current;
                const isActive = i === current;

                return (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                        {/* Step pill */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                            <div style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: isCompleted ? "#2563EB" : isActive ? "#EFF6FF" : "#F1F5F9",
                                border: isActive ? "2px solid #2563EB" : isCompleted ? "none" : "2px solid #E2E8F0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: isCompleted ? "#FFFFFF" : isActive ? "#2563EB" : "#94A3B8",
                                flexShrink: 0,
                            }}>
                                {isCompleted ? "✓" : i + 1}
                            </div>
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "#0F172A" : isCompleted ? "#2563EB" : "#94A3B8",
                                whiteSpace: "nowrap",
                            }}>
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: "1px",
                                background: isCompleted ? "#2563EB" : "#E2E8F0",
                                margin: "0 0.75rem",
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}