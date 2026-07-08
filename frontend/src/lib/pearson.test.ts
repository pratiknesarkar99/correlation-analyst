import { describe, it, expect } from "vitest";
import { mean, stdDev, pearson, computeCorrelationMatrix } from "./pearson";

describe("mean", () => {
    it("computes mean of simple values", () => {
        expect(mean([1, 2, 3, 4, 5])).toBe(3);
    });

    it("returns 0 for empty array", () => {
        expect(mean([])).toBe(0);
    });

    it("handles single value", () => {
        expect(mean([42])).toBe(42);
    });
});

describe("stdDev", () => {
    it("computes standard deviation correctly", () => {
        const values = [2, 4, 4, 4, 5, 5, 7, 9];
        const mu = mean(values);
        expect(stdDev(values, mu)).toBeCloseTo(2.0, 5);
    });

    it("returns 0 for constant values", () => {
        expect(stdDev([5, 5, 5], 5)).toBe(0);
    });

    it("returns 0 for empty array", () => {
        expect(stdDev([], 0)).toBe(0);
    });
});

describe("pearson", () => {
    it("returns 1 for perfectly positively correlated data", () => {
        const x = [1, 2, 3, 4, 5];
        const y = [2, 4, 6, 8, 10];
        expect(pearson(x, y)).toBeCloseTo(1.0, 5);
    });

    it("returns -1 for perfectly negatively correlated data", () => {
        const x = [1, 2, 3, 4, 5];
        const y = [10, 8, 6, 4, 2];
        expect(pearson(x, y)).toBeCloseTo(-1.0, 5);
    });

    it("returns 0 for uncorrelated data", () => {
        const x = [1, 2, 3, 4, 5];
        const y = [3, 3, 3, 3, 3];
        expect(pearson(x, y)).toBe(0);
    });

    it("returns 0 for mismatched array lengths", () => {
        expect(pearson([1, 2, 3], [1, 2])).toBe(0);
    });

    it("computes a known correlation value correctly", () => {
        const x = [1, 2, 3, 4, 5];
        const y = [5, 3, 4, 1, 2];
        expect(pearson(x, y)).toBeCloseTo(-0.8, 5);
    });
});

describe("computeCorrelationMatrix", () => {
    const rows = [
        { a: 1, b: 2, c: 5 },
        { a: 2, b: 4, c: 4 },
        { a: 3, b: 6, c: 3 },
        { a: 4, b: 8, c: 2 },
        { a: 5, b: 10, c: 1 },
    ];

    it("generates correct number of pairs", () => {
        const matrix = computeCorrelationMatrix(rows, ["a", "b", "c"]);
        expect(matrix.length).toBe(3); // (a,b), (a,c), (b,c)
    });

    it("correctly identifies perfect positive correlation", () => {
        const matrix = computeCorrelationMatrix(rows, ["a", "b", "c"]);
        const abPair = matrix.find((e) => e.colA === "a" && e.colB === "b");
        expect(abPair?.r).toBeCloseTo(1.0, 5);
    });

    it("correctly identifies perfect negative correlation", () => {
        const matrix = computeCorrelationMatrix(rows, ["a", "b", "c"]);
        const acPair = matrix.find((e) => e.colA === "a" && e.colB === "c");
        expect(acPair?.r).toBeCloseTo(-1.0, 5);
    });

    it("includes means and stddevs in each entry", () => {
        const matrix = computeCorrelationMatrix(rows, ["a", "b", "c"]);
        const abPair = matrix.find((e) => e.colA === "a" && e.colB === "b");
        expect(abPair?.xMean).toBe(3);
        expect(abPair?.yMean).toBe(6);
    });
});