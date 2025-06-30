const { calculateTicks } = require("./tick");

// Constants for test cases
const MIN_TICK = -887272;
const MAX_TICK = 887272;
const TICK_SPACING = 60;
const DEFAULT_TICK_RANGE = 10;

describe("calculateTicks", () => {
    it("should calculate ticks correctly within the valid range", () => {
        const price = 1.0001;
        const tickRange = 10;

        const result = calculateTicks(price, TICK_SPACING, tickRange);
        expect(result.tickLower).toBeGreaterThanOrEqual(MIN_TICK);
        expect(result.tickUpper).toBeLessThanOrEqual(MAX_TICK);
        expect(result.currentTick % TICK_SPACING).toBe(0); // Aligned to tickSpacing
    });

    it("should handle price resulting in minimum tick", () => {
        const price = 1e-10;

        const result = calculateTicks(price, TICK_SPACING, DEFAULT_TICK_RANGE);
        expect(result.tickLower).toBe(-230880); // Update expected value if correct
        expect(result.tickUpper).toBeLessThanOrEqual(MAX_TICK);
    });

    it("should handle price resulting in maximum tick", () => {
        const price = 1e10;

        const result = calculateTicks(price, TICK_SPACING, DEFAULT_TICK_RANGE);
        expect(result.tickLower).toBeGreaterThanOrEqual(MIN_TICK);
        expect(result.tickUpper).toBe(230820); // Update expected value if correct
    });

    it("should respect the tickRange parameter", () => {
        const price = 1.0001;
        const tickRange = 5;

        const result = calculateTicks(price, TICK_SPACING, tickRange);
        expect(result.tickUpper - result.tickLower).toBe(TICK_SPACING * tickRange * 2);
    });

    it("should default tickRange to 10 if not provided", () => {
        const price = 1.0001;

        const result = calculateTicks(price, TICK_SPACING);
        expect(result.tickUpper - result.tickLower).toBe(TICK_SPACING * DEFAULT_TICK_RANGE * 2);
    });
});