import { describe, it, expect } from "vitest";
import { parseCSV } from "./csvParser";

const SIMPLE_CSV = `name,age,salary
Alice,30,50000
Bob,25,45000
Carol,35,60000`;

const MIXED_CSV = `city,population,country
New York,8000000,USA
London,9000000,UK`;

const EMPTY_CSV = ``;

describe("parseCSV", () => {
    it("identifies numeric columns correctly", () => {
        const result = parseCSV(SIMPLE_CSV);
        expect(result.numericColumns).toEqual(["age", "salary"]);
    });

    it("excludes non-numeric columns", () => {
        const result = parseCSV(SIMPLE_CSV);
        expect(result.numericColumns).not.toContain("name");
    });

    it("parses numeric rows with correct values", () => {
        const result = parseCSV(SIMPLE_CSV);
        expect(result.numericRows[0]).toEqual({ age: 30, salary: 50000 });
    });

    it("returns correct row count", () => {
        const result = parseCSV(SIMPLE_CSV);
        expect(result.numericRows.length).toBe(3);
    });

    it("handles all non-numeric columns gracefully", () => {
        const result = parseCSV(MIXED_CSV);
        expect(result.numericColumns).toEqual(["population"]);
    });

    it("handles empty input gracefully", () => {
        const result = parseCSV(EMPTY_CSV);
        expect(result.allColumns).toEqual([]);
        expect(result.numericRows).toEqual([]);
    });
});