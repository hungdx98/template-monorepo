import { QUOTER_ABI, QUOTER_ADDRESS } from '@/services/abi/quoter';
import { SWAP_ROUTER_ABI, SWAP_ROUTER_ADDRESS } from '@/services/abi/swapRouter';
import { ResponseStructure } from '@/structure'; // Assuming ResponseStructure is imported here
import { applySlippage } from '@/utils/quote';
import Cors from 'cors';
import dns from 'dns';
import { BigNumber } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import Web3 from 'web3';
// Set the DNS resolver to use IPv4 first
// This is important for environments where IPv6 might not be configured properly
// This ensures that DNS lookups prioritize IPv4 addresses, which is often necessary in server environments.
dns.setDefaultResultOrder('ipv4first');

// -- CORS Middleware
// This middleware is used to handle CORS requests
// It allows cross-origin requests to the API, which is necessary for frontend applications to access the API.
Cors({ methods: ['POST', 'HEAD'] });

const web3 = new Web3('https://rpc.viction.xyz');
const fees = [500, 3000, 10000]; // Example fee values, adjust as needed

interface QuoteRequest {
    token0: string; // Address of token0 (must be a valid Ethereum address)
    token1: string; // Address of token1 (must be a valid Ethereum address)
    amountIn: string; // Input amount as a string (e.g., "1000000000000000000" for 1 token in wei)
    fee: number; // Fee tier (e.g., 500, 3000, 10000)
    wallet: string; // Wallet address (must be a valid Ethereum address)
    slippage?: number; // Slippage percentage (default is 0.5%)
    sqrtPriceLimitX96?: number; // Optional price limit, default is 0 (no limit)
}

export async function POST(_req: NextRequest) {
    /**
     * Slippage is a common parameter in trading applications to protect against price changes during transactions
     * Default slippage is set to 0.5% if not provided
     */
    const body = await _req.json() as QuoteRequest; // Parse the request body as JSON
    const { token0, token1, amountIn, fee, sqrtPriceLimitX96 = 0, slippage = 0.5, wallet } = body;

    // const { token0, token1, amountIn, fee, sqrtPriceLimitX96 = 0, slippage = 0.5, wallet } = body as QuoteRequest;
    try {

        validateInputs({ token0, token1, amountIn, fee, wallet });

        const quoterContract = new web3.eth.Contract(QUOTER_ABI, QUOTER_ADDRESS);
        const swapRouterContract = new web3.eth.Contract(SWAP_ROUTER_ABI, SWAP_ROUTER_ADDRESS);
        if (!quoterContract.methods || !quoterContract.methods.quoteExactInputSingle) {
            throw new Error('quoteExactInputSingle method is not defined on the contract');
        }

        const amountOut = await quoterContract.methods.quoteExactInputSingle(
            token0,
            token1,
            fee,
            amountIn,
            sqrtPriceLimitX96
        ).call() as BigNumber;

        if (!amountOut) {
            return NextResponse.json(
                ResponseStructure.error('No output amount calculated'),
                { status: 400 }
            );
        }
        console.log('amountOut', amountOut);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const amountOutMin = applySlippage(amountOut, slippage); // 0.5% slippage
        const params = {
            tokenIn: token0,
            tokenOut: token1,
            fee,
            recipient: wallet,
            deadline,
            amountIn: amountIn.toString(),
            amountOutMinimum: amountOutMin.toString(),
            sqrtPriceLimitX96: 0,
        };
        if (!swapRouterContract.methods || !swapRouterContract.methods.exactInputSingle) {
            throw new Error('exactInputSingle method is not defined on the contract');
        }
        const dataRaw = swapRouterContract.methods.exactInputSingle(params).encodeABI();
        const tx = {
            from: wallet,
            to: SWAP_ROUTER_ADDRESS,
            data: dataRaw,
            approveAddress: SWAP_ROUTER_ADDRESS,
        }

        swapRouterContract
        return NextResponse.json(
            ResponseStructure.success(
                { ...params, amountOut: amountOut.toString(), transaction: tx },
                'Quote fetched successfully'
            ),
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json(
            ResponseStructure.error(`Failed to fetch quote: ${error.message || 'Unknown error'}`),
            { status: 500 }
        );
    }
}

// Helper function to validate inputs
const validateInputs = (P: QuoteRequest) => {
    const { token0, token1, amountIn, fee, wallet } = P;
    console.log('validateInputs', P);
    if (!token0 || !token1 || !amountIn || !fee || !wallet) {
        throw new Error('Missing required parameters: token0, token1, amountIn, fee, or wallet');
    }
    if (!web3.utils.isAddress(token0) || !web3.utils.isAddress(token1)) {
        throw new Error('Invalid token addresses provided');
    }
    if (!web3.utils.isAddress(wallet)) {
        throw new Error('Invalid wallet address provided');
    }
    if (typeof amountIn !== 'string' || isNaN(Number(amountIn))) {
        throw new Error('Invalid amountIn provided');
    }
    if (Number(fee) <= 0 || !fees.includes(Number(fee))) {
        throw new Error('Invalid fee provided');
    }
}
