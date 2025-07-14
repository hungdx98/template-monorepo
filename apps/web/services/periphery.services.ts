import _get from 'lodash/get';
import Web3, { Transaction } from 'web3';
import { NFT_POSITION_MANAGER_ABI } from './abi';
import { ERC20ABI } from './abi/ERC20';
import { FACTORY_ABI } from './abi/factory';
import { POOL_ABI } from './abi/pool';
import { FACTORY_ADDRESS, NFT_POSITION_MANAGER_ADDRESS } from './constants';
import { IAddPosition, ICreatePool, PositionInfo } from './types';

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
            const poolAddress: string = await contract.methods.getPool(token0, token1, fee).call();
            if (poolAddress === '0x0000000000000000000000000000000000000000') return '';
            return poolAddress as unknown as string;
        } catch (error: any) {
            throw new Error("Pool not found for the given token pair and fee: " + error?.message);
        }
    }

    static getPoolInfo = async (poolAddress: string): Promise<any> => {
        if (!poolAddress) return null;
        const contractPool = new this.client.eth.Contract(POOL_ABI, poolAddress);
        if (!contractPool.methods.slot0) {
            throw new Error("slot0 method is not available on the contract");
        }
        const poolDetail = await contractPool.methods.slot0().call();
        return poolDetail
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

    static approveToken = async (params: any) => {
        const { wallet, token, amount } = params;
        const contract = new this.client.eth.Contract(ERC20ABI as any, token.address)

        if (!contract.methods.approve) {
            throw new Error("approve method is not available on the contract");
        }

        const spender = this.nftPositionManagerAddress; // NFT_POSITION_MANANGER_ADDRESS
        const amountHex = `0x${Number(amount).toString(16)}`; // Convert amount to hex

        // const rawApproveAmountHex = this.client.utils.isHexStrict(amount) ? amount : this.client.utils.toHex(amount)
        // console.log("rawApproveAmountHex", rawApproveAmountHex);

        console.log("approveToken", { wallet, token, amount, amountHex });
        const dataTx = contract?.methods?.approve(spender, amountHex).encodeABI()

        const tx: Transaction = {
            from: wallet, // Replace with your wallet address
            to: token.address,
            data: dataTx,
        };

        return tx;

    }

    // static getSqrtPriceX96 = (rate: number): bigint => {
    //      const contract = this.getContractFactory();
    // }

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

        const contract = new this.client.eth.Contract(NFT_POSITION_MANAGER_ABI, this.nftPositionManagerAddress);

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

    static getTransactionReceipt = async (txHash: string): Promise<any> => {
        const receipt = await this.client.eth.getTransactionReceipt(txHash)
        return receipt;
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

    static increaseLiquidity = async (tokenId: number, amount0Desired: string, amount1Desired: string, wallet: string) => {
        // Logic to increase liquidity in a position in the Uniswap V3 pool
        const contractNFTManager = this.getContractNFTPositionManager();
        const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes from now

        if (!contractNFTManager.methods.increaseLiquidity) {
            throw new Error("increaseLiquidity method is not available on the contract");
        }

        const dataTx = contractNFTManager.methods.increaseLiquidity({
            tokenId,
            amount0Desired,
            amount1Desired,
            amount0Min: 0,
            amount1Min: 0,
            deadline,
        }).encodeABI();

        const tx: Transaction = {
            from: wallet,
            to: this.nftPositionManagerAddress,
            data: dataTx,
        };
        return tx;
    }

    static decreaseLiquidity = async (tokenId: number, wallet: string) => {
        // Logic to decrease liquidity in a position in the Uniswap V3 pool
        const multicallData: any[] = [];
        const MAX_UINT128 = (2n ** 128n - 1n).toString();
        const contractNFTManager = this.getContractNFTPositionManager();
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 10 minutes from now
        try {
            if (!contractNFTManager.methods.positions) {
                throw new Error("positions method is not available on the contract");
            }
            const pos = await contractNFTManager.methods.positions(tokenId).call();
            const liquidity = _get(pos, 'liquidity', 0n);
            if (liquidity > 0n) {
                const decreaseParams = {
                    tokenId,
                    liquidity,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: deadline
                };
                const call1 = this.client.eth.abi.encodeFunctionCall({
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "tokenId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint128",
                                    "name": "liquidity",
                                    "type": "uint128"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount0Min",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount1Min",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct INonfungiblePositionManager.DecreaseLiquidityParams",
                            "name": "params",
                            "type": "tuple"
                        }
                    ],
                    "name": "decreaseLiquidity",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount1",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                }, [decreaseParams]);
                multicallData.push(call1)
            }

            console.log("check token id", tokenId);

            const call2 = this.client.eth.abi.encodeFunctionCall({
                inputs: [
                    {
                        components: [
                            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                            { internalType: 'address', name: 'recipient', type: 'address' },
                            { internalType: 'uint128', name: 'amount0Max', type: 'uint128' },
                            { internalType: 'uint128', name: 'amount1Max', type: 'uint128' },
                        ],
                        internalType: 'struct INonfungiblePositionManager.CollectParams',
                        name: 'params',
                        type: 'tuple',
                    },
                ],
                name: 'collect',
                outputs: [
                    { internalType: 'uint256', name: 'amount0', type: 'uint256' },
                    { internalType: 'uint256', name: 'amount1', type: 'uint256' },
                ],
                stateMutability: 'payable',
                type: 'function',
            }, [{
                tokenId,
                recipient: wallet,
                amount0Max: MAX_UINT128, // Use MAX_UINT128 as a string
                amount1Max: MAX_UINT128, // Use MAX_UINT128 as a string
            }]);
            multicallData.push(call2);


            const call3 = this.client.eth.abi.encodeFunctionCall({
                inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'payable',
                type: 'function',
            }, [tokenId]);
            multicallData.push(call3);


            if (!contractNFTManager.methods.multicall) {
                throw new Error("multicall method is not available on the contract");
            }
            const tx = await contractNFTManager.methods.multicall(multicallData).encodeABI();

            return {
                from: wallet,
                to: this.nftPositionManagerAddress,
                data: tx,
            };
        } catch (error) {
            console.error(`Error closing position ${tokenId}:`, error);
        }
    }

    static initializeSqrtPriceX96 = (rate: number, wallet: string, poolAddress: string): Transaction => {
        const sqrtPrice = Math.sqrt(rate); // token1/token0
        const sqrtPriceX96 = BigInt(sqrtPrice * 2 ** 96); // sqrtPriceX96 = sqrtPrice * 2^96
        const contractPool = new this.client.eth.Contract(POOL_ABI, poolAddress);
        if (!contractPool.methods.initialize) {
            throw new Error("initialize method is not available on the contract");
        }
        const txRaw = contractPool.methods.initialize(sqrtPriceX96).encodeABI();
        // Create the transaction object
        const tx: Transaction = {
            from: wallet, // Replace with your wallet address
            to: poolAddress,
            data: txRaw,
        };
        return tx;
    }
}