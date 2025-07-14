'use client'
import React from "react";
import Image from "next/image";
import Head from "next/head";
import { useWallet } from "@meshsdk/react";
import HomePage  from "@/app/(pages)/home/page"
import WalletConnectButton from "./Components/Atoms/WalletConnectButton";
import Board from './Components/Molecules/board';
import { Balance } from "./Components/Atoms/Balance";
import { ExchangeRates } from './Components/Atoms/NewBal';

export default function Home() {
  const { connected } = useWallet();

  return (
    <div>
      
      {!connected ? 
        (
          // 🔴 Not connected: show Connect Button
          <WalletConnectButton />
        ) : 
        (
          // 🟢 Connected: show homepage content
          
          <HomePage/>
          // <Board /> 
          // <Balance />
          // <ExchangeRates /> 
          
        )
      }
    
    </div>
  );
}
