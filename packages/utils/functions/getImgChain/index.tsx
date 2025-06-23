export function mapBlockChainImageName(chainName: string) {
  const mapChainData: { [key in string]: string } = {
    orangeTestnet: 'orange',
    ethereum: 'ether',
    ETHEREUM: 'ether',
    orange: 'orange',
    binanceSmart: 'binanceSmart',
    BNB: 'binanceSmart',
  };
  return mapChainData[chainName] || (chainName || '').toLowerCase();
}

export const getImgFromChainName = (
  name: string,
): {
  chain: string;
  currency: string;
} => {
  const chainName = mapBlockChainImageName(name);

  return {
    chain: `https://general-inventory.coin98.tech/app/chain/${chainName}.png`,
    currency: `https://general-inventory.coin98.tech/app/currency/${chainName}.png`,
  };
};
