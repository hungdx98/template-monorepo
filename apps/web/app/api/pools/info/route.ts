import { FACTORY_ABI, NFT_POSITION_MANAGER_ABI } from '@/services/abi';
import { FACTORY_ADDRESS, NFT_POSITION_MANAGER_ADDRESS } from '@/services/constants';
import { ResponseStructure } from '@/structure'; // Assuming ResponseStructure is imported here
import Cors from 'cors';
import dns from 'dns';
import { NextRequest, NextResponse } from 'next/server';
import Web3 from 'web3';
import _get from 'lodash/get';
import { POOL_ABI } from '@/services/abi/pool';
import axios from 'axios';
// Set the DNS resolver to use IPv4 first
// This is important for environments where IPv6 might not be configured properly
// This ensures that DNS lookups prioritize IPv4 addresses, which is often necessary in server environments.
dns.setDefaultResultOrder('ipv4first');

// -- CORS Middleware
// This middleware is used to handle CORS requests
// It allows cross-origin requests to the API, which is necessary for frontend applications to access the API.
Cors({ methods: ['GET', 'HEAD'] });

const web3 = new Web3('https://viction.blockpi.network/v1/rpc/public');
const Q96 = 2n ** 96n;
const Q192 = Q96 * Q96;

export async function GET(_req: NextRequest) {
    // Extracting nftId and address from the query parameters
    const { searchParams } = new URL(_req.url);
    const nftId = searchParams.get('nftId');
    const address = searchParams.get('position');
    console.log('nftId:', nftId, 'address:', address);
    if (!address || !web3.utils.isAddress(address) || !nftId) {
        return NextResponse.json(
            ResponseStructure.error('Invalid or missing positions address or NFT ID'),
            { status: 400 }
        );
    }
    const contract = new web3.eth.Contract(NFT_POSITION_MANAGER_ABI, NFT_POSITION_MANAGER_ADDRESS);
    const contractFactory = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);
    try {
        if (!contract.methods.balanceOf) {
            throw new Error('balanceOf method is not available on the contract');
        }

        if (!contract.methods.positions) {
            throw new Error('positions method is not available on the contract');
        }
        const position = await contract.methods.positions(nftId).call();
        if (!contractFactory.methods.getPool) {
            throw new Error('getPool method is not available on the contractFactory');
        }

        const contractPool = new web3.eth.Contract(POOL_ABI, address);
        if (!contractPool.methods.slot0) {
            throw new Error('slot0 method is not available on the contractPool');
        }
        const slot0 = await contractPool.methods.slot0().call();

        const sqrtPriceX96 = _get(slot0, 'sqrtPriceX96', 0n);
        const tick = Number(_get(slot0, 'tick', 0).toString());
        const { amount0, amount1 } = getAmountsForLiquidity(
            sqrtPriceX96,
            BigInt(_get(position, 'tickLower', 0)),
            BigInt(_get(position, 'tickUpper', 0)),
            BigInt(_get(position, 'liquidity', 0)),
        );
        if (!contract.methods.tokenURI) {
            throw new Error('tokenURI method is not available on the contract');
        }
        const uri: string = await contract.methods.tokenURI(nftId).call();
        const responseURI = await axios.get(uri);
        const nftMetadata = JSON.parse(_get(responseURI, 'data', {}));
        // Convert all bigint values to strings
        const formattedPosition = Object.fromEntries(
            Object.entries({ tokenId: nftId, nftMetadata, ...position, sqrtPriceX96, tick, amount0, amount1 }).map(([key, value]) => [
                key,
                typeof value === 'bigint' ? (value as bigint).toString() : value,
            ])
        );

        return NextResponse.json(
            ResponseStructure.success(
                { position: formattedPosition },
                'Fetched positions successfully'
            ),
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json(
            ResponseStructure.error(`Failed to fetch positions: ${error.message || 'Unknown error'}`),
            { status: 500 }
        );
    }
}

function tickToSqrtPriceX96(tick: bigint): bigint {
    const tickNumber = Number(tick);
    const sqrtRatio = Math.sqrt(Math.pow(1.0001, tickNumber));
    return BigInt(Math.floor(sqrtRatio * Number(Q96)));
}

function getAmount0(liquidity: bigint, sqrtA: bigint, sqrtB: bigint): bigint {
    const numerator = liquidity * (sqrtB - sqrtA) * Q96;
    const denominator = sqrtB * sqrtA;
    return numerator / denominator;
}

function getAmount1(liquidity: bigint, sqrtA: bigint, sqrtB: bigint): bigint {
    return liquidity * (sqrtB - sqrtA) / Q96;
}

function getAmountsForLiquidity(
    sqrtPriceX96: bigint,
    tickLower: bigint,
    tickUpper: bigint,
    liquidity: bigint
): { amount0: bigint; amount1: bigint } {
    let sqrtA = tickToSqrtPriceX96(tickLower);
    let sqrtB = tickToSqrtPriceX96(tickUpper);

    if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];

    if (sqrtPriceX96 <= sqrtA) {
        // dưới range → chỉ token0
        return {
            amount0: getAmount0(liquidity, sqrtA, sqrtB),
            amount1: 0n,
        };
    } else if (sqrtPriceX96 < sqrtB) {
        // trong range → cả token0 và token1
        return {
            amount0: getAmount0(liquidity, sqrtPriceX96, sqrtB),
            amount1: getAmount1(liquidity, sqrtA, sqrtPriceX96),
        };
    } else {
        // trên range → chỉ token1
        return {
            amount0: 0n,
            amount1: getAmount1(liquidity, sqrtA, sqrtB),
        };
    }
}