"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = '00bc088c4562cbad8696764bfe08cd24'

// 2. Set chains
const mainnet = {
  chainId: 84532,
  name: 'Sepolia',
  currency: 'SepoliaETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://sepolia.etherscan.io/	'
}

// 3. Create modal
const metadata = {
  name: 'SquadFi',
  description: 'SquadFi is a platform for managment of staking clusters.',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId
})

export function Web3ModalProvider({ children }: any) {
  return children;
}