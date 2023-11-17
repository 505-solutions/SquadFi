'use client';

import {useState, useEffect} from 'react'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { SafeTransactionDataPartial, OperationType } from '@safe-global/safe-core-sdk-types'
import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Button } from '@mantine/core';
import { useSDK } from '@metamask/sdk-react';


interface EthClient {
  isConnected: boolean;
  address?: any;
}


export default function HomePage() {
  const { sdk, provider } = useSDK();

  const proposeToGnosis = async () => {
    console.log('Propose to Gnosis')
          
    // Get signer using MetaMask
    const signer = provider.getSigner();

    
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })  

    const safeApiKit = new SafeApiKit({
      txServiceUrl: 'https://safe-transaction-sepolia.safe.global',
      ethAdapter
    })

    console.log(await signer.getAddress())

    // Create Safe instance
    const safe = await Safe.create({
      ethAdapter,
      safeAddress: '0x1170095589C944ccE2a801271703079b484527f4'
    })
    
    // Create transaction
    const safeTransactionData: SafeTransactionDataPartial = {
      to: await signer.getAddress(),
      value: '1000000', // 1 wei
      data: '0x',
      operation: OperationType.Call
    }
    
    const safeTransaction = await safe.createTransaction({ safeTransactionData })
    
    const senderAddress = await signer.getAddress()
    const safeTxHash = await safe.getTransactionHash(safeTransaction)
    const signature = await safe.signTransactionHash(safeTxHash)
    
    // Propose transaction to the service
    await safeApiKit.proposeTransaction({
      safeAddress: await safe.getAddress(),
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress,
      senderSignature: signature.data
    })  
    alert('Success! Check your Safe {Wallet}')
  }  

  return (
        <>
        <HeaderMegaMenu />
        <div>
            <Button onClick={e => proposeToGnosis()}>Send multisig to Safe</Button>
        </div>
          <FooterCentered />
        </>
    
  )
}
