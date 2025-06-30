import _toLower from 'lodash/toLower';
import { PeripheryService } from './periphery.services';
import { IAddPosition } from './types';

const wallet = "0x835d5e132039987A994c6288777DbF7d1Bb511A5";
const token0 = "0xAa6F3E52cb0571b88E58A93FD1Cc0744254909D2";
const token1 = "0x111111267109489dc6f350608d5113B10c0C5cd7";
const poolAddressDefault = "0xbed7c9715637c9c7b9288d23dc4fde1f9bd4e509"; // Mocked pool address for testing
const amount0Desired = 1000n;
const amount1Desired = 2000n;

describe('PeripheryService', () => {
    it('getPoolAddress should return the pool address', async () => {
        const poolAddress = await PeripheryService.getPoolAddress(token0, token1, 3000);
        expect(_toLower(poolAddress)).toBe(_toLower(poolAddressDefault));
    });

    it('getPositionInfo should return position info', async () => {
        const positionInfo = await PeripheryService.getPositionInfo(1);
        const mockResponse = {
            "0": 0n,
            "1": "0x0000000000000000000000000000000000000000",
            "10": 0n,
            "11": 0n,
            "2": "0x111111267109489dc6f350608d5113B10c0C5cd7",
            "3": "0xAa6F3E52cb0571b88E58A93FD1Cc0744254909D2",
            "4": 3000n,
            "5": 6300n,
            "6": 7500n,
            "7": 45479526747042698n,
            "8": 0n,
            "9": 0n,
            "__length__": 12,
            "fee": 3000n,
            "feeGrowthInside0LastX128": 0n,
            "feeGrowthInside1LastX128": 0n,
            "liquidity": 45479526747042698n,
            "nonce": 0n,
            "operator": "0x0000000000000000000000000000000000000000",
            "tickLower": 6300n,
            "tickUpper": 7500n,
            "token0": "0x111111267109489dc6f350608d5113B10c0C5cd7",
            "token1": "0xAa6F3E52cb0571b88E58A93FD1Cc0744254909D2",
            "tokensOwed0": 0n,
            "tokensOwed1": 0n,
        }
        expect(positionInfo).toEqual(mockResponse);
    });

    it('getTickSpacingForFee should return tick spacing', async () => {
        const tickSpacing = await PeripheryService.getTickSpacingForFee(3000);
        expect(tickSpacing).toBe(60n);
    });

    it('createPool should return a transaction object', async () => {
        const params = {
            wallet: wallet,
            rate: 1.0001,
            token0,
            token1,
            fee: 3000,
        };

        const tx = await PeripheryService.createPool(params);
        expect(tx).toEqual({
            from: wallet,
            to: PeripheryService.nftPositionManagerAddress,
            data: '0x13ead562000000000000000000000000aa6f3e52cb0571b88e58a93fd1cc0744254909d2000000000000000000000000111111267109489dc6f350608d5113b10c0c5cd70000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000001000346d6ff11600000000000',
        });
    });

    it('addPosition should return a transaction object', async () => {
        const params: IAddPosition = {
            wallet,
            token0,
            token1,
            amount0Desired,
            amount1Desired,
            fee: 3000,
            tickLower: -887220, // Example tick lower values
            tickUpper: 887220, // Example tick upper values
            deadline: 1234567890, // Mocked deadline for testing
        };

        const tx = await PeripheryService.addPosition(params);
        expect(tx).toEqual({
            from: wallet,
            to: PeripheryService.nftPositionManagerAddress,
            data: '0x88316456000000000000000000000000aa6f3e52cb0571b88e58a93fd1cc0744254909d2000000000000000000000000111111267109489dc6f350608d5113b10c0c5cd70000000000000000000000000000000000000000000000000000000000000bb8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2764c00000000000000000000000000000000000000000000000000000000000d89b400000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000835d5e132039987a994c6288777dbf7d1bb511a500000000000000000000000000000000000000000000000000000000499602d2',
        });
    });
});