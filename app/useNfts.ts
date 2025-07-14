import { useWallet } from '@meshsdk/react';
import { BlockfrostProvider } from '@meshsdk/core';
import { NFT } from '@/app/types';

export const useNFTs = () => {
  const { wallet, connected } = useWallet();

  const fetchNFTs = async (): Promise<NFT[]> => {
    if (!connected || !wallet) {
      return [];
    }

    try {
      const isTestnet = (await wallet.getUsedAddresses())[0]?.startsWith('addr_test') ?? true;
      const blockfrostProvider = new BlockfrostProvider(
        isTestnet
          ? process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY!
          : process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY!
      );

      const assets = await wallet.getAssets();
      const nfts: NFT[] = [];

      for (const asset of assets) {
        // Parse unit to extract policyId and assetName
        const unit = asset.unit;
        const policyId = unit.slice(0, 56); // Policy ID is first 56 characters
        const assetName = unit.slice(56); // Asset name is the rest

        // Fetch metadata from Blockfrost for additional details
        let metadata: any = {};
        try {
          const assetInfo = await blockfrostProvider.fetchAssetMetadata(unit);
          metadata = assetInfo.onchain_metadata || {};
        } catch (err) {
          console.warn(`Failed to fetch metadata for asset ${unit}:`, err);
        }

        nfts.push({
          id: unit,
          name: metadata.name || assetName || 'Unknown NFT',
          image: metadata.image || '/fallback-nft-image.png',
          collection: metadata.collection || 'Unknown Collection',
          recycleValue: metadata.recycleValue || '0',
          policyId,
          assetName,
          attributes: metadata.attributes || {},
        });
      }

      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  };

  return { fetchNFTs };
};