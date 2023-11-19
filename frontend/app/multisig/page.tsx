"use client";

import { useState, useEffect } from "react";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import {
  SafeTransactionDataPartial,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { FooterCentered } from "@/components/Footer/FooterCentered";
import { HeaderMegaMenu } from "@/components/Header/HeaderMegaMenu";
import { Button } from "@mantine/core";
import { useSDK } from "@metamask/sdk-react";
import {
  useWeb3ModalSigner,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import type { Signer } from "ethers";

import depositAbi from "../../SquadFiDeposits.json";

interface EthClient {
  isConnected: boolean;
  address?: any;
}

export default function HomePage() {
  const { signer } = useWeb3ModalSigner();

  const proposeToGnosis = async () => {
    console.log("Propose to Gnosis");

    const contractAddress = "0xabcdef1234567890abcdef1234567890abcdef12"; // Replace with your smart contract address
    const contract = new ethers.Contract(contractAddress, depositAbi.abi);

    const functionName = "activateValidator";
    const functionParams = [
      12345,
      "0x00000000219ab540356cBB839Cbe05303d7705Fa",
      "0x00000000219ab540356cBB839Cbe05303d7705Fa",
      "0x00000000219ab540356cBB839Cbe05303d7705Fa",
      "0x256d42922dd9a4d9fd1c94b1428bd0f301f2004ba9e60bc48a69fde3245673e2",
    ];

    // Encode the function call data
    const data = contract.interface.encodeFunctionData(
      functionName,
      functionParams
    );

    if (!signer) {
      return false;
    }

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeApiKit = new SafeApiKit({
      txServiceUrl: "https://safe-transaction-sepolia.safe.global",
      ethAdapter,
    });

    console.log(await signer.getAddress());

    // Create Safe instance
    const safe = await Safe.create({
      ethAdapter,
      safeAddress: "0x1170095589C944ccE2a801271703079b484527f4",
    });

    // Create transaction
    const safeTransactionData: SafeTransactionDataPartial = {
      to: await signer.getAddress(),
      value: "1000000", // 1 wei
      data: "0x",
      operation: OperationType.Call,
    };

    const safeTransaction = await safe.createTransaction({
      safeTransactionData,
    });

    const senderAddress = await signer.getAddress();
    const safeTxHash = await safe.getTransactionHash(safeTransaction);
    const signature = await safe.signTransactionHash(safeTxHash);

    // Propose transaction to the service
    await safeApiKit.proposeTransaction({
      safeAddress: await safe.getAddress(),
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress,
      senderSignature: signature.data,
    });
    alert("Success! Check your Safe {Wallet}");
  };

  return (
    <>
      <HeaderMegaMenu />
      <div>
        <Button onClick={(e) => proposeToGnosis()}>
          Send multisig to Safe
        </Button>
      </div>
      <FooterCentered />
    </>
  );
}
