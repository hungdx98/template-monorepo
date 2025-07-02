import Web3, { Transaction } from 'web3'
import { NFT_POSITION_MANAGER_ABI } from './abi';
import { IAddPosition, ICreatePool, PositionInfo } from './types';
import { FACTORY_ABI } from './abi/factory';
import { FACTORY_ADDRESS, NFT_POSITION_MANAGER_ADDRESS } from './constants';

export class PeripheryService {
    static client: Web3 = new Web3('https://rpc.viction.xyz');
    static nftPositionManagerAddress: string = NFT_POSITION_MANAGER_ADDRESS;
    static factoryAddress = FACTORY_ADDRESS;

    static getContractNFTPositionManager = () => {
        return new this.client.eth.Contract(NFT_POSITION_MANAGER_ABI, this.nftPositionManagerAddress);
    }

    static getContractFactory = () => {
        return new this.client.eth.Contract(FACTORY_ABI, this.factoryAddress);
    }

    static getPoolAddress = async (token0: string, token1: string, fee: number): Promise<string> => {
        const contract = this.getContractFactory();
        if (!contract.methods.getPool) {
            throw new Error("getPool method is not available on the contract");
        }
        try {
            const poolAddress = await contract.methods.getPool(token0, token1, fee).call();
            return poolAddress as unknown as string;
        } catch (error: any) {
            throw new Error("Pool not found for the given token pair and fee: " + error?.message);
        }
    }

    static getPositionInfo = async (tokenId: number): Promise<PositionInfo> => {
        const contract = this.getContractNFTPositionManager();
        if (!contract.methods.positions) {
            throw new Error("positions method is not available on the contract");
        }
        const poolInfo = await contract.methods.positions(tokenId).call();
        return poolInfo as unknown as PositionInfo;
    }

    static getTickSpacingForFee = async (fee: number): Promise<number> => {
        const contract = this.getContractFactory();
        if (!contract.methods.feeAmountTickSpacing) {
            throw new Error("feeAmountTickSpacing method is not available on the contract");
        }
        const tickSpacing = await contract.methods.feeAmountTickSpacing(fee).call();
        return tickSpacing as unknown as number;
    }

    static createPool = async (params: ICreatePool): Promise<Transaction> => {
        const { wallet, rate, token0, token1, fee } = params;
        // Logic to create a new position in the Uniswap V3 pool
        const sqrtPrice = Math.sqrt(rate); // token1/token0
        const sqrtPriceX96 = BigInt(sqrtPrice * 2 ** 96); // sqrtPriceX96 = sqrtPrice * 2^96
        const contract = new this.client.eth.Contract(NFT_POSITION_MANAGER_ABI, this.nftPositionManagerAddress)

        if (!contract.methods.createAndInitializePoolIfNecessary) {
            throw new Error("createAndInitializePoolIfNecessary method is not available on the contract");
        }
        const txCreatePool = contract.methods.createAndInitializePoolIfNecessary(
            token0,
            token1,
            fee,
            sqrtPriceX96
        ).encodeABI();

        const tx: Transaction = {
            from: wallet, // Replace with your wallet address
            to: this.nftPositionManagerAddress,
            data: txCreatePool,
        };

        return tx;
    }

    static addPosition = async (params: IAddPosition): Promise<Transaction> => {
        const { wallet, token0, token1, amount0Desired, amount1Desired, fee, tickLower, tickUpper, deadline } = params;
        // Logic to add a new position to the Uniswap V3 pool
        const contract = this.getContractNFTPositionManager();

        if (!contract.methods.mint) {
            throw new Error("mint method is not available on the contract");
        }
        const rawData = contract.methods.mint({
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            amount0Desired,
            amount1Desired,
            amount0Min: 0,
            amount1Min: 0,
            recipient: wallet,
            deadline,
        }).encodeABI();

        const tx: Transaction = {
            from: wallet, // Replace with your wallet address
            to: this.nftPositionManagerAddress,
            data: rawData,
        };

        return tx;
    }

    static removePosition = async () => {
        // Logic to remove an existing position from the Uniswap V3 pool
    }

    static collectFees = async () => {
        // Logic to collect fees from a position in the Uniswap V3 pool
    }

    static getTotalSupplyNFT = async (): Promise<number> => {
        const contract = this.getContractNFTPositionManager();
        if (!contract.methods.totalSupply) {
            throw new Error("totalSupply method is not available on the contract");
        }
        const totalSupply = await contract.methods.totalSupply().call();
        return totalSupply as unknown as number;
    }

    static listPoolsWithSupply = async (totalSupply: number) => {
        for (let i = 1; i <= totalSupply; i++) {
            try {
                const positionInfo = await this.getPositionInfo(i);
                console.log(`Position ID: ${i}, Info:`, positionInfo);
            } catch (error) {
                console.error(`Error fetching position ${i}:`, error);
            }
        }
    }
}