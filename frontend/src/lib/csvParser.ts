import type { ParsedDataset } from "../types/dataset";

function parseCSVText(text: string): Record<string, string>[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    return lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        return headers.reduce((row, header, i) => {
            row[header] = values[i] ?? "";
            return row;
        }, {} as Record<string, string>);
    });
}

function isNumericColumn(
    rows: Record<string, string>[],
    column: string
): boolean {
    return rows.every((row) => {
        const val = row[column];
        return val !== "" && !isNaN(Number(val));
    });
}

export function parseCSV(text: string): ParsedDataset {
    const rawRows = parseCSVText(text);
    if (rawRows.length === 0) {
        return {
            allColumns: [],
            numericColumns: [],
            rows: [],
            numericRows: [],
        };
    }

    const allColumns = Object.keys(rawRows[0]);
    const numericColumns = allColumns.filter((col) =>
        isNumericColumn(rawRows, col)
    );

    const numericRows = rawRows.map((row) =>
        numericColumns.reduce((acc, col) => {
            acc[col] = Number(row[col]);
            return acc;
        }, {} as Record<string, number>)
    );

    return {
        allColumns,
        numericColumns,
        rows: rawRows,
        numericRows,
    };
}