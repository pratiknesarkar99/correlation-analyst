import { useState } from "react";
import type { MatrixEntry } from "../types/dataset";

interface AnalysisRequest {
    description: string;
    matrix: MatrixEntry[];
}

interface UseAnalysisResult {
    interpretation: string;
    isLoading: boolean;
    error: string;
    run: (request: AnalysisRequest) => Promise<void>;
}

export function useAnalysis(): UseAnalysisResult {
    const [interpretation, setInterpretation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function run(request: AnalysisRequest) {
        setInterpretation("");
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setInterpretation((prev) => prev + chunk);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return { interpretation, isLoading, error, run };
}