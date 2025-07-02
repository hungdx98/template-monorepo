import { redisClient } from '@/lib/redis';
import { ERC20_ABI, FACTORY_ABI } from '@/services/abi';
import { FACTORY_ADDRESS } from '@/services/constants';
import { ResponseStructure } from '@/structure';
import Cors from 'cors';
import dns from 'dns';
import _size from 'lodash/size';
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

export async function GET() {
    try {
        const fromBlock = 95427873;
        const toBlock = 'latest';
        const limit = 1000;

        const factory = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);
        const cacheKey = `clmm-v3:pools:${fromBlock}:${toBlock}:${limit}`;
        // ✅ Check cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return new Response(
                JSON.stringify(ResponseStructure.success(
                    JSON.parse(cached),
                    'Fetched pools from cache successfully'
                )), { status: 200 }
            );
        }

        //@ts-ignore
        const events = await factory.getPastEvents('PoolCreated', {
            fromBlock,
            toBlock,
        });

        const sliced = await Promise.all(events
            .filter((event): event is EventLog => typeof event !== 'string')
            .slice(0, limit)
            .map(async (event) => {
                const { token0, token1, fee, pool } = event.returnValues;
                const [token0Meta, token1Meta] = await Promise.all([
                    getTokenInfo(token0 as string),
                    getTokenInfo(token1 as string),
                ]);
                return {
                    token0: { ...token0Meta, address: token0 },
                    token1: { ...token1Meta, address: token1 },
                    fee: BigInt(fee as bigint).toString(),
                    pool,
                    blockNumber: BigInt(event.blockNumber as bigint).toString(),
                }
            }));

        // If no pools found, return an empty array with count 0
        if (!_size(sliced)) {
            return new Response(
                JSON.stringify(ResponseStructure.success(
                    { pools: [], count: 0 },
                    'No pools found'
                )), { status: 200 }
            );
        }

        const data = { pools: sliced, count: sliced.length };
        await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 }); // Cache for 1 minutes

        return new Response(
            JSON.stringify(ResponseStructure.success(
                { pools: sliced, count: sliced.length },
                'Fetched pool successfully'
            )),
            { status: 200 }
        );

    } catch (err: any) {
        return new Response(
            JSON.stringify(ResponseStructure.error(`Failed to fetch pools: ${err.message || 'Unknown error'}`)),
            { status: 500 }
        );
    }
}

// ✅ Helper: fetch token info
const getTokenInfo = async (tokenAddress: string) => {
    try {
        const token = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        if (token.methods.symbol === undefined || token.methods.name === undefined || token.methods.decimals === undefined) {
            return { symbol: 'UNKNOWN', name: 'Unknown Token', decimals: 18 };
        }
        const [symbol, name, decimals] = await Promise.all([
            token.methods.symbol().call(),
            token.methods.name().call(),
            token.methods.decimals().call(),
        ]);
        return { symbol, name, decimals: parseInt(decimals as unknown as string) };
    } catch (e) {
        return { symbol: 'UNKNOWN', name: 'Unknown Token', decimals: 18 };
    }
};