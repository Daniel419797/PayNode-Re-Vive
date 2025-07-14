'use client'

import { CardanoWallet } from '@meshsdk/react'


const WalletConnectButton = () => {


  return (
    <div>
      <CardanoWallet  isDark={true} showDownload={true} onConnected={() => console.log('Wallet Connected')} persist={false} label={'Connect wallet'} />
    </div>
  )
}

export default WalletConnectButton
