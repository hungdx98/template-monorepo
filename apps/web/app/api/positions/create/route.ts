import { NFT_POSITION_MANAGER_ABI } from '@/services/abi';
import { NFT_POSITION_MANAGER_ADDRESS } from '@/services/constants';
import { ResponseStructure } from '@/structure'; // Assuming ResponseStructure is imported here
import Cors from 'cors';
import dns from 'dns';
import _size from 'lodash/size';
import { NextRequest, NextResponse } from 'next/server';
import Web3, { EventLog } from 'web3';
// Set the DNS resolver to use IPv4 first
// This is important for environments where IPv6 might not be configured properly
// This ensures that DNS lookups prioritize IPv4 addresses, which is often necessary in server environments.
dns.setDefaultResultOrder('ipv4first');

// -- CORS Middleware
// This middleware is used to handle CORS requests
// It allows cross-origin requests to the API, which is necessary for frontend applications to access the API.
Cors({ methods: ['GET', 'HEAD'] });

const web3 = new Web3('https://rpc.viction.xyz');

export async function GET(_req: NextRequest) {
    // const body = await _req.json() as QuoteRequest; // Parse the request body as JSON
    // const { token0, token1, amountIn, fee, sqrtPriceLimitX96 = 0, slippage = 0.5, wallet } = body;
    try {
        const { searchParams } = new URL(_req.url);
        // Extract parameters from the search query
        const block = searchParams.get('block') || '0';

        const nftPositionManagerContract = new web3.eth.Contract(NFT_POSITION_MANAGER_ABI, NFT_POSITION_MANAGER_ADDRESS);

        //@ts-ignore
        const events = await nftPositionManagerContract.getPastEvents('IncreaseLiquidity', {
            fromBlock: block,
            toBlock: block,
        });
        const sliced = await Promise.all(
            events.filter((event): event is EventLog => typeof event !== 'string')
                .slice(0, 1)
                .map(async (event) => {
                    const { tokenId, liquidity, amount0, amount1 } = event.returnValues;
                    return {
                        nftId: BigInt(tokenId as bigint).toString(),
                        liquidity: BigInt(liquidity as bigint).toString(),
                        amount0: BigInt(amount0 as bigint).toString(),
                        amount1: BigInt(amount1 as bigint).toString(),
                    };
                })
        )
        // If no pools found, return an empty array with count 0
        if (!_size(sliced)) {
            return new Response(
                JSON.stringify(ResponseStructure.success(
                    {},
                    'No TokenId found'
                )), { status: 200 }
            );
        }

        return NextResponse.json(
            ResponseStructure.success(
                { ...sliced[0] },
                'Get nftId successfully'
            ),
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            ResponseStructure.error(`Failed to fetch nftId: ${error.message || 'Unknown error'}`),
            { status: 500 }
        );
    }
}