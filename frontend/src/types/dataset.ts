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