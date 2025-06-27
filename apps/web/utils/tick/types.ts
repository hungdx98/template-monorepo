// Define the input props type
export type CalculateTicksProps = {
    price: number;
    tickSpacing: number;
    tickRange?: number; // Optional since it has a default value
};

// Define the return type
export type CalculateTicksReturn = {
    tickLower: number;
    tickUpper: number;
    currentTick: number;
};