// // lib/fetchNFTs.ts
// import { fetchAssets, fetchAssetMetadata } from '@meshsdk/core';
// import type { Wallet } from '@meshsdk/core';

// export async function fetchNFTs(wallet: Wallet, filterPolicyId?: string) {
//   try {
//     const usedAddresses = await wallet.getUsedAddresses();
//     if (!usedAddresses || usedAddresses.length === 0) return [];

//     const address = usedAddresses[0];

//     // Get all assets in wallet
//     const assets = await wallet.getAssets();

//     // Filter only NFTs (1 quantity, metadata exists, optionally by policyId)
//     const nftAssets = assets.filter((asset) => {
//       const isNFT = asset.quantity === '1';
//       const matchesPolicy = filterPolicyId
//         ? asset.unit.startsWith(filterPolicyId)
//         : true;
//       return isNFT && matchesPolicy;
//     });

//     // Fetch metadata for each NFT
//     const nftDetails = await Promise.all(
//       nftAssets.map(async (asset) => {
//         const metadata = await fetchAssetMetadata(asset.unit);
//         return {
//           unit: asset.unit,
//           name: metadata.name,
//           image: metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/'),
//           description: metadata.description,
//           policyId: asset.unit.slice(0, 56),
//         };
//       })
//     );

//     return nftDetails;
//   } catch (error) {
//     console.error('Failed to fetch NFTs:', error);
//     return [];
//   }
// }
