export interface ParsedDataset {
    allColumns: string[];
    numericColumns: string[];
    rows: Record<string, number | string>[];
    numericRows: Record<string, number>[];
}

export interface DatasetMeta {
    description: string;
    fileName: string;
    rowCount: number;
    numericColumnCount: number;
}

export interface MatrixEntry {
    colA: string;
    colB: string;
    r: number;
    n: number;
    xMean: number;
    yMean: number;
    xStdDev: number;
    yStdDev: number;
}