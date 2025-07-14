// import { NextResponse } from 'next/server';
// import { BlockfrostProvider, Transaction, AppWallet } from '@meshsdk/core';

// const userStatsDB: Record<string, { recycledCount: number; revTokens: number; rank: number }> = {};

// const REV_TOKEN = {
//   policyId: 'your_policy_id_here',
//   assetName: 'your_asset_name_here', // hex-encoded asset name
// };

// function getNetworkFromAddress(address: string): 'mainnet' | 'testnet' | 'unknown' {
//   if (address.startsWith('addr_test1')) return 'testnet';
//   if (address.startsWith('addr1')) return 'mainnet';
//   return 'unknown';
// }

// interface RecycleRequest {
//   nftId: string;
//   walletAddress: string;
//   assetName: string;
//   policyId: string;
//   txHash: string;
// }

// export async function POST(req: Request) {
//   const { nftId, walletAddress, assetName, policyId, txHash } = await req.json() as RecycleRequest;

//   if (!nftId || !walletAddress || !assetName || !policyId || !txHash) {
//     return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
//   }

//   const network = getNetworkFromAddress(walletAddress);
//   if (network === 'unknown') {
//     return NextResponse.json({ success: false, message: 'Invalid wallet address/network' }, { status: 400 });
//   }

//   const blockfrost = new BlockfrostProvider(
//     network === 'testnet'
//       ? process.env.BLOCKFROST_PREPROD_API_KEY!
//       : process.env.BLOCKFROST_MAINNET_API_KEY!
//   );

//   const backendWallet = new AppWallet({
//     networkId: network === 'testnet' ? 0 : 1,
//     fetcher: blockfrost,
//     key: {
//       type: 'mnemonic',
//       words: process.env.BACKEND_WALLET_MNEMONIC!.split(' '),
//     },
//   });
  

//   try {
//     const txInfo = await blockfrost.fetchTxInfo(txHash);
//     if (!txInfo) {
//       return NextResponse.json({ success: false, message: 'Invalid transaction hash' }, { status: 400 });
//     }

//     let isBurnValid = false;
//     for (const output of txInfo.outputs) {
//       for (const amount of output.amount) {
//         if (amount.unit === `${policyId}${assetName}` && parseInt(amount.quantity) < 0) {
//           isBurnValid = true;
//           break;
//         }
//       }
//       if (isBurnValid) break;
//     }

//     if (!isBurnValid) {
//       return NextResponse.json({ success: false, message: 'Transaction does not burn the specified NFT' }, { status: 400 });
//     }

//     let recycleValue = 5;
//     try {
//       const assetInfo = await blockfrost.fetchAssetMetadata(`${policyId}${assetName}`);
//       recycleValue = parseInt(assetInfo.onchain_metadata?.recycleValue || '5');
//       if (isNaN(recycleValue)) recycleValue = 5;
//     } catch (err) {
//       console.warn(`Failed to fetch metadata for ${nftId}:`, err);
//     }

//     const tx = new Transaction({ initiator: backendWallet });
//     tx.sendAssets(
//       { address: walletAddress },
//       [{ unit: `${REV_TOKEN.policyId}${REV_TOKEN.assetName}`, quantity: recycleValue.toString() }]
//     );

//     const unsignedTx = await tx.build();
//     const signedTx = await backendWallet.signTx(unsignedTx);
//     const txHashResult = await backendWallet.submitTx(signedTx);

//     if (!userStatsDB[walletAddress]) {
//       userStatsDB[walletAddress] = { recycledCount: 0, revTokens: 0, rank: 999 };
//     }
//     userStatsDB[walletAddress].recycledCount += 1;
//     userStatsDB[walletAddress].revTokens += recycleValue;
//     userStatsDB[walletAddress].rank = Math.max(1, userStatsDB[walletAddress].rank - 1);

//     console.log('NFT recycled:', {
//       nftId,
//       walletAddress,
//       recycleValue,
//       txHash: txHashResult,
//       timestamp: new Date().toISOString(),
//     });

//     return NextResponse.json({ success: true, revTokens: recycleValue });
//   } catch (err: any) {
//     console.error('Error processing NFT recycle:', {
//       error: err.message,
//       nftId,
//       walletAddress,
//       timestamp: new Date().toISOString(),
//     });
//     return NextResponse.json({ success: false, message: `Server error: ${err.message}` }, { status: 500 });
//   }
// }
