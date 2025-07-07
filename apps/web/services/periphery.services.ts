import Web3, { Transaction } from 'web3'
import { NFT_POSITION_MANAGER_ABI } from './abi';
import { IAddPosition, ICreatePool, PositionInfo } from './types';
import { FACTORY_ABI } from './abi/factory';
import { ERC20ABI } from './abi/ERC20';

export class PeripheryService {
    static client: Web3 = new Web3('https://rpc.viction.xyz');
    static nftPositionManagerAddress = "0x0762f5542f5436d56b7a1FcD70879eCF1Ea167b8";
    static factoryAddress = '0x85368A086a23989ba326Aab2CCEf50DC649f9b39'; // UniswapV3Factory address

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
            const poolAddress : string = await contract.methods.getPool(token0, token1, fee).call();
            if(poolAddress === '0x0000000000000000000000000000000000000000') return '';
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

    static approveToken = async (params:any) => {
        const { wallet, token, amount } = params;
        const contract = new this.client.eth.Contract(ERC20ABI as any, token.address)
        
        if (!contract.methods.approve) {
            throw new Error("approve method is not available on the contract");
        }
        
        const spender = this.nftPositionManagerAddress; // NFT_POSITION_MANANGER_ADDRESS
        const amountHex = this.client.utils.toHex(amount); // Convert amount to hex

        const rawApproveAmountHex = this.client.utils.isHexStrict(amount) ? amount : this.client.utils.toHex(amount)

        console.log("rawApproveAmountHex", rawApproveAmountHex);
        
        console.log("approveToken", { wallet, token, amount, amountHex });
        const dataTx = contract?.methods?.approve(spender, rawApproveAmountHex).encodeABI()

        const tx: Transaction = {
            from: wallet, // Replace with your wallet address
            to: token.address,
            data: dataTx,
        };

        return tx;
       
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
        const getToken0 = token1 < token0 ? token1 : token0; // Ensure token0 is always the smaller address
        const getToken1 = token1 < token0 ? token0 : token1; // Ensure
        const txCreatePool = contract.methods.createAndInitializePoolIfNecessary(
            getToken0,
            getToken1,
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
        // const contract = this.getContractNFTPositionManager();

        const contract =  new this.client.eth.Contract(NFT_POSITION_MANAGER_ABI, this.nftPositionManagerAddress);

        console.log(contract)

        if (!contract.methods.mint) {
            throw new Error("mint method is not available on the contract");
        }
        
        const rawData = contract?.methods?.mint({
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
}