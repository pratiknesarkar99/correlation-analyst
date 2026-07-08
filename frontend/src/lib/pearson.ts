import type { MatrixEntry } from "../types/dataset";

export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function stdDev(values: number[], mu: number): number {
    if (values.length === 0) return 0;
    const variance =
        values.reduce((sum, v) => sum + Math.pow(v - mu, 2), 0) / values.length;
    return Math.sqrt(variance);
}

export function pearson(xValues: number[], yValues: number[]): number {
    const n = xValues.length;
    if (n !== yValues.length || n === 0) return 0;

    const xMean = mean(xValues);
    const yMean = mean(yValues);
    const xStd = stdDev(xValues, xMean);
    const yStd = stdDev(yValues, yMean);

    if (xStd === 0 || yStd === 0) return 0;

    const covariance =
        xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0) / n;

    return covariance / (xStd * yStd);
}

export function computeCorrelationMatrix(
    numericRows: Record<string, number>[],
    numericColumns: string[]
): MatrixEntry[] {
    const matrix: MatrixEntry[] = [];

    for (let i = 0; i < numericColumns.length; i++) {
        for (let j = i + 1; j < numericColumns.length; j++) {
            const colA = numericColumns[i];
            const colB = numericColumns[j];

            const xValues = numericRows.map((row) => row[colA]);
            const yValues = numericRows.map((row) => row[colB]);

            const xMean = mean(xValues);
            const yMean = mean(yValues);

            matrix.push({
                colA,
                colB,
                r: pearson(xValues, yValues),
                n: xValues.length,
                xMean,
                yMean,
                xStdDev: stdDev(xValues, xMean),
                yStdDev: stdDev(yValues, yMean),
            });
        }
    }

    return matrix;
}