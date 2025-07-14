'use client';

import { useState, useEffect } from 'react';
import { useWallet, useAddress } from '@meshsdk/react';
import { X, Copy, Check, Download } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import QRCode from 'qrcode';

interface ReceiveModalProps {
  onCloseAction: () => void; // ✅ renamed
}

export function ReceiveModal({ onCloseAction }: ReceiveModalProps) {
  const { state } = useApp();
  const { connected } = useWallet()
  const address = useAddress()
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl);
    }
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 h-[100dvh] flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full h-[100%]">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receive ADA</h3>
          <button
            onClick={onCloseAction} // ✅ updated
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-scroll overflow-x-hidden h-[80dvh] space-y-6">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              {qrCodeUrl && (
                <img 
                  src={qrCodeUrl} 
                  alt="Wallet QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scan this QR code to send ADA to your wallet
            </p>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Wallet Address
            </label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <code className="flex-1 text-xs text-gray-600 dark:text-gray-300 font-mono break-all">
                {address}
              </code>
              <button
                onClick={copyAddress}
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={copyAddress}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Download className="w-4 h-4" />
              <span>Save QR</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">How to receive ADA:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Share your wallet address or QR code</li>
              <li>• Wait for the sender to complete the transaction</li>
              <li>• Funds will appear in your wallet within minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
