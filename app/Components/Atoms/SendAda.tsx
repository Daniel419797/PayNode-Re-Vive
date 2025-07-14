import { Transaction, IWallet } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';
import { useState } from 'react';

// Define the interface for the function parameters
interface SendAdaParams {
  recipientAddress: string;
  amountLovelace: string; // Amount in lovelace (1 ADA = 1,000,000 lovelace)
  wallet: IWallet; // Updated to use IWallet instead of BrowserWallet
}

// Function to send ADA
export const sendAda = async ({ recipientAddress, amountLovelace, wallet }: SendAdaParams): Promise<string> => {
  try {
    // Initialize a new transaction with the connected wallet
    const tx = new Transaction({ initiator: wallet });

    // Add the ADA (lovelace) to send to the recipient address
    tx.sendLovelace(recipientAddress, amountLovelace);

    // Build the transaction
    const unsignedTx = await tx.build();

    // Sign the transaction
    const signedTx = await wallet.signTx(unsignedTx);

    // Submit the transaction
    const txHash = await wallet.submitTx(signedTx);

    console.log('Transaction submitted successfully:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error sending ADA:', error);
    throw new Error(`Failed to send ADA: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Example React component to use the sendAda function
export default function SendAdaComponent() {
  const { wallet, connected } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // Amount in ADA
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendAda = async () => {
    if (!connected) {
      setError('Please connect your wallet first.');
      return;
    }

    if (!recipient || !amount) {
      setError('Recipient address and amount are required.');
      return;
    }

    try {
      // Convert ADA to lovelace (1 ADA = 1,000,000 lovelace)
      const amountLovelace = (parseFloat(amount) * 1_000_000).toString();
      const hash = await sendAda({
        recipientAddress: recipient,
        amountLovelace,
        wallet,
      });
      setTxHash(hash);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>Send ADA</h2>
      <div>
        <label>
          Recipient Address:
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="addr_test1..."
          />
        </label>
      </div>
      <div>
        <label>
          Amount (ADA):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.5"
          />
        </label>
      </div>
      <button onClick={handleSendAda} disabled={!connected}>
        Send ADA
      </button>
      {txHash && <p>Transaction Hash: {txHash}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}









// import { BlockfrostProvider, MeshTxBuilder } from '@meshsdk/core';
// import { useWallet } from '@meshsdk/react';
// import { useState } from 'react';
// // import { Address } from '@emurgo/cardano-serialization-lib-browser';

// export const useMeshSend = () => {
//   const { connected, wallet, name } = useWallet();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [estimatedFee, setEstimatedFee] = useState<string | null>(null);

//   // const validateAddress = (address: string): boolean => {
//   //   try {
//   //     Address.from_bech32(address);
//   //     return true;
//   //   } catch (err) {
//   //     console.warn('Address validation failed:', err);
//   //     // Fallback to basic prefix check if WASM fails
//   //     return address.startsWith('addr1') || address.startsWith('addr_test1');
//   //   }
//   // };

//   const estimateFee = async (txBuilder: MeshTxBuilder): Promise<string> => {
//     try {
//       // Attempt to estimate fee using MeshTxBuilder
//       const unsignedTx = await txBuilder.complete();
//       // Mesh SDK doesn't directly expose fee, so we use a default estimate
//       // For accurate fee, you may need to integrate with a backend or use cardano-serialization-lib
//       return '170000'; // Default fee of 0.17 ADA (170,000 Lovelace) as fallback
//     } catch (err) {
//       console.warn('Fee estimation failed:', err);
//       return '170000'; // Fallback fee
//     }
//   };

//   const handleSend = async (
//     recipientAddress: string,
//     amount: string, // Amount in Lovelace
//     metadata?: { [key: string]: any }
//   ) => {
//     setLoading(true);
//     setError(null);
//     setTxHash(null);
//     setEstimatedFee(null);

//     try {
//       // Check if wallet is connected
//       if (!connected || !wallet) {
//         throw new Error('No wallet is connected. Please connect a wallet first.');
//       }

//       // Validate recipient address
//       // if (!validateAddress(recipientAddress)) {
//       //   throw new Error('Invalid Cardano address. Please provide a valid address starting with addr1 or addr_test1.');
//       // }

//       // Validate amount
//       const amountInLovelace = parseInt(amount);
//       if (isNaN(amountInLovelace) || amountInLovelace <= 0) {
//         throw new Error('Amount must be a positive number.');
//       }

//       // Log the connected wallet name for debugging
//       console.log(`Using wallet: ${name}`);

//       // type net = {
//       //   preprod: string;
//       //   mainnet: string;
//       // }

      
      

//       // const preprod = process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY
//       // const mainnet = process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY

//       const network = await wallet.getNetworkId()
      
//       // {network == 1 ? (
//       //     mainnet
        
//       //   ) : (
//       //     preprod
//       //   )
//       // }

//       let baseUrl

//       if (network == 1) {
//         baseUrl = process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY
//       } else{
//         baseUrl = process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY
//       }


//       const provider = new BlockfrostProvider(`${baseUrl}`)

//       // Initialize Mesh transaction builder
//       const txBuilder = new MeshTxBuilder({
//         fetcher: provider,
//         verbose: true,
//       });

//       // Create transaction
//       txBuilder
//         .txOut(recipientAddress, [{ unit: 'lovelace', quantity: amount }])
//         .changeAddress(await wallet.getChangeAddress());

//       // Add metadata if provided
//       if (metadata) {
//         const metadataString = JSON.stringify(metadata);
//         txBuilder.metadataValue('674', metadataString); // Use CIP-20 key for simple messages
//       }

//       // Estimate fee
//       const fee = await estimateFee(txBuilder);
//       setEstimatedFee(fee);

//       // Build final transaction
//       const unsignedTx = await txBuilder.complete();

//       // Sign transaction
//       const signedTx = await wallet.signTx(unsignedTx);

//       // Submit transaction
//       const _txHash = await wallet.submitTx(signedTx);
//       setTxHash(_txHash);

//       return { txHash: _txHash, fee };
//     } catch (err: any) {
//       let errorMessage = 'Transaction failed';
//       if (err.message.includes('Insufficient input in transaction')) {
//         errorMessage = 'Insufficient funds in wallet to cover the amount and fee.';
//       } else if (err.message.includes('Network error')) {
//         errorMessage = 'Network error. Please check your connection and try again.';
//       } else if (err.message.includes('Failed to estimate transaction fee')) {
//         errorMessage = 'Unable to calculate transaction fee. Using default fee.';
//       } else if (err.message.includes('WebAssembly')) {
//         errorMessage = 'WebAssembly module failed to load. Please ensure your browser supports WebAssembly.';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
//       setError(errorMessage);
//       console.error('Mesh SDK Error:', err);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { handleSend, loading, error, txHash, estimatedFee, connected, walletName: name };
// };