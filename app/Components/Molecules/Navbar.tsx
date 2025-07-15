'use client'
import React from 'react';
import { useWallet } from '@meshsdk/react';
import { Wallet, Sun, Moon } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import WalletConnectButton from '@/app/Components/Atoms/WalletConnectButton';

const Navbar = () => {
  const { wallet, connected, name, disconnect } = useWallet();
  const { state, dispatch } = useApp();

  // const truncatedAddress = wallet
  //   ? `${wallet.rewardAddresses[0].slice(0, 6)}...${wallet.rewardAddresses[0].slice(-4)}`
  //   : '';

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 w-[100%] right-[0] ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:justify-end items-center h-16">
          <h1 className="text-xl md:hidden font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            PayVerse
          </h1>

          <div className="flex items-center space-x-4">
            {state.user && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">{state.user.revTokens} ReV</span>
              </div>
            )}

            {<WalletConnectButton/>}

            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {state.darkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
