'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Group, TextInput, Button, Modal, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAddressBook, IconCheck, IconCircleCheck, IconUser, IconArrowBigRightLineFilled } from '@tabler/icons-react';
import { IconBlockquote, IconPlus, IconUserBolt, IconUserSquare, IconUsersGroup } from '@tabler/icons-react';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import {useState, useEffect} from 'react'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { SafeTransactionDataPartial, OperationType } from '@safe-global/safe-core-sdk-types'
import { useWeb3ModalSigner, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import type { Signer } from 'ethers'
import depositAbi from "../../../out/Deposit.sol/SquadFiDeposits.json";


export default function CreateCluster() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      validatorId: null,
      pubKey: null,
      withdrawCredentials: null,
      blsSignature: null,
      depositDataRoute: null,
      safeAddress: null,
    },
  });     
  
  const { signer } = useWeb3ModalSigner()

  const sendToSafe = async (values: any) => {
    console.log('Propose to Gnosis')

    if (!(signer)){
        return false;
    }
    
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
      safeAddress: values.safeAddress
    })
    
    // Create transaction


    const contractAddress = "0xabcdef1234567890abcdef1234567890abcdef12"; // Replace with your smart contract address
    const contract = new ethers.Contract(contractAddress, depositAbi.abi);

    const functionName = "activateValidator";
    const functionParams = [
      values.validatorId,
      values.pubKey,
      values.withdrawCredentials,
      values.blsSignature,
      values.depositDataRoute,
    ];

    console.log(functionParams)

    // Encode the function call data
    const dataBytes = contract.interface.encodeFunctionData(
      functionName,
      functionParams
    );

    const safeTransactionData: SafeTransactionDataPartial = {
      to: await signer.getAddress(), // CONTRACT ADDRESS!
      value: '1', // 1 wei
      data: dataBytes,
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
    open()
  }  


  return (
    <>
      <Group
        style={{
          backgroundImage: `url(/background.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          padding: '0',
          margin: '0',
          display: 'block',
        }}
      >
      <HeaderMegaMenu />
      <form onSubmit={form.onSubmit((values) => sendToSafe(values))}>
      <Group style={{flexDirection: 'column', width: '500px', margin: 'auto'}}>

        <h1 style={{display: 'block', margin: 'auto'}}>Activate a cluster</h1>

        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>VALIDATOR ID</p>
        <TextInput
          placeholder="Validator ID in Smart Contract"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          {...form.getInputProps('validatorId')}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>VALIDATOR PUB KEY</p>
        <TextInput
          placeholder="Assigned Validator Public Key"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          {...form.getInputProps('pubKey')}
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>WITHDRAW CREDENTIALS</p>
        <TextInput
          placeholder="Generated Withdraw Credentials"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          {...form.getInputProps('withdrawCredentials')}

          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>BLS SIGNATURE</p>
        <TextInput
          placeholder="Generated BLS Signature"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          {...form.getInputProps('blsSignature')}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>DEPOSIT DATA ROUTE</p>
        <TextInput
          placeholder="ETH Staking Contract"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          {...form.getInputProps('depositDataRoute')}
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />

      <Divider size="md" />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>SAFE (multisig) Wallet Address</p>
        <TextInput
          placeholder="Squad's SAFE Wallet Address"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          {...form.getInputProps('safeAddress')}
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <Button
          style={{marginTop: '20px', backgroundColor: "#EEAD36"}}
          variant="gradient"
          gradient={{ from: '#EEAD36', to: '#E97333', deg: 90 }}
          size="xl"
          type='submit'
          rightSection={<IconArrowBigRightLineFilled />}
        >
          Send multisig TX to SAFE
        </Button>
      </Group>
      </form>

      <Modal opened={opened} onClose={close} title="Success" centered size="lg">
        <IconCircleCheck size={64} color="green" style={{display: "block", margin: "auto"}}/>
        <h2 style={{textAlign: 'center'}}>Your transaction proposal has been sent to SAFE Wallet.</h2>
        <p style={{textAlign: 'center'}}>Sign the proposal to activate your cluster/validator.</p>
        <Link href="exploreClusters" style={{textDecoration: 'none', color: 'white'}}>
          <Button type='submit' color='#EEAD36' style={{display: 'block', margin: 'auto'}}>Sign in SAFE Wallet</Button>
        </Link>
      </Modal>

      <FooterCentered />
      </Group>
    </>
  );
}
