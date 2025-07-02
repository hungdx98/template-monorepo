import { NFT_POSITION_MANAGER_ABI } from '@/services/abi';
import { NFT_POSITION_MANAGER_ADDRESS } from '@/services/constants';
import { ResponseStructure } from '@/structure'; // Assuming ResponseStructure is imported here
import Cors from 'cors';
import dns from 'dns';
import { NextRequest, NextResponse } from 'next/server';
import Web3 from 'web3';
// Set the DNS resolver to use IPv4 first
// This is important for environments where IPv6 might not be configured properly
// This ensures that DNS lookups prioritize IPv4 addresses, which is often necessary in server environments.
dns.setDefaultResultOrder('ipv4first');

// -- CORS Middleware
// This middleware is used to handle CORS requests
// It allows cross-origin requests to the API, which is necessary for frontend applications to access the API.
Cors({ methods: ['GET', 'HEAD'] });

const web3 = new Web3('https://rpc.viction.xyz');

export async function GET(_req: NextRequest, props: {
    params: Promise<{
        address: string;
    }>
}) {
    const params = await props.params;
    const { address } = params;

    if (!address || !web3.utils.isAddress(address)) {
        return NextResponse.json(
            ResponseStructure.error('Invalid or missing address'),
            { status: 400 }
        );
    }
    console.log('Fetching positions for owner:', address);
    const contract = new web3.eth.Contract(NFT_POSITION_MANAGER_ABI, NFT_POSITION_MANAGER_ADDRESS);
    try {
        if (!contract.methods.balanceOf) {
            throw new Error('balanceOf method is not available on the contract');
        }
        const balance = await contract.methods.balanceOf(address).call();
        console.log('Balance:', balance);
        const positions = [];

        for (let i = 0; i < Number(balance); i++) {
            if (!contract.methods.tokenOfOwnerByIndex) {
                throw new Error('tokenOfOwnerByIndex method is not available on the contract');
            }
            const tokenId = await contract.methods.tokenOfOwnerByIndex(address, i).call();
            if (!contract.methods.positions) {
                throw new Error('positions method is not available on the contract');
            }
            const position = await contract.methods.positions(tokenId).call();

            // Convert all bigint values to strings
            const formattedPosition = Object.fromEntries(
                Object.entries({ tokenId, ...position }).map(([key, value]) => [
                    key,
                    typeof value === 'bigint' ? (value as bigint).toString() : value,
                ])
            );

            positions.push(formattedPosition);
        }

        console.log('Positions:', positions);
        return NextResponse.json(
            ResponseStructure.success(
                { count: positions.length, positions },
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