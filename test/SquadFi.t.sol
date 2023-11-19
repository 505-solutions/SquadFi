// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";

import {SquadFiDeposits} from "../src/Deposit.sol";
import {RewardShareNFT} from "../src/RewardShareNFT.sol";
import {OptimisticWithdrawalRecipientFactory} from "../src/obolOwr/OwrFactory.sol";

contract SquadFiTest is Test {
    SquadFiDeposits public depositContract;
    RewardShareNFT public nftManagerContract;
    OptimisticWithdrawalRecipientFactory public owrFactoryContract;

    address splitterContractAddress =
        address(0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE); // holesky contract address

    address ensRegistry = address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    address reverseRegistar =
        address(0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6);

    address owner = address(8953626958234137847422389523978938749873);

    address user1 = address(11111111);
    address user2 = address(22222222);
    address user3 = address(33333333);
    address user4 = address(44444444);

    uint constant validatorId = 123456789;
    uint256 constant spliterScaleFactor = 1000000;

    function setUp() public {
        vm.startPrank(owner);

        // Mint 100 eth to the owner
        vm.deal(owner, 100 * 10 ** 18);
        vm.deal(user1, 100 * 10 ** 18);
        vm.deal(user2, 100 * 10 ** 18);
        vm.deal(user3, 100 * 10 ** 18);
        vm.deal(user4, 100 * 10 ** 18);

        depositContract = new SquadFiDeposits(owner);

        nftManagerContract = new RewardShareNFT(
            owner,
            splitterContractAddress,
            address(depositContract)
        );

        owrFactoryContract = new OptimisticWithdrawalRecipientFactory(
            owner,
            address(depositContract),
            "SquadFi",
            address(0),
            address(0),
            address(0)
        );

        depositContract.setOwrFactory(address(owrFactoryContract));
        depositContract.setNftManager(address(nftManagerContract));
    }

    function test_registerValidator() public {
        address[] memory feeAddresses = new address[](4);
        uint32[] memory percentAllocations = new uint32[](4);

        feeAddresses[0] = user1;
        feeAddresses[1] = user2;
        feeAddresses[2] = user3;
        feeAddresses[3] = user4;

        percentAllocations[0] = uint32(2 * spliterScaleFactor); /* 2% */
        percentAllocations[1] = uint32(2 * spliterScaleFactor); /* 2% */
        percentAllocations[2] = uint32(2 * spliterScaleFactor); /* 2% */
        percentAllocations[3] = uint32(2 * spliterScaleFactor); /* 2% */

        depositContract.registerValidator(
            validatorId,
            feeAddresses,
            percentAllocations,
            owner, // ? gnosis multisig
            "cluster_name"
        );
    }

    function test_makeContributions() public {
        test_registerValidator();

        vm.startPrank(user1);
        depositContract.contributeToValidator{value: 8 ether}(validatorId);

        vm.startPrank(user2);
        depositContract.contributeToValidator{value: 8 ether}(validatorId);

        vm.startPrank(user3);
        depositContract.contributeToValidator{value: 8 ether}(validatorId);

        vm.startPrank(user4);
        depositContract.contributeToValidator{value: 8 ether}(validatorId);
    }

    function test_cancelContributions() public {
        test_makeContributions();

        vm.startPrank(user1);
        depositContract.cancelContribution(validatorId);

        vm.startPrank(user2);
        depositContract.cancelContribution(validatorId);

        vm.startPrank(user3);
        depositContract.cancelContribution(validatorId);

        vm.startPrank(user4);
        depositContract.cancelContribution(validatorId);
    }

    function test_activateValidator() public {
        test_makeContributions();

        vm.startPrank(owner);
        depositContract.activateValidator(
            validatorId,
            bytes(""),
            bytes(""),
            bytes(""),
            bytes32(0)
        );
    }

    function test_transferingNfts() public {
        test_activateValidator();

        // uint256 bal = balanceOf(feeRecipients[0], 25);

        uint256 bal1 = nftManagerContract.balanceOf(address(user1), 25);
        uint256 bal2 = nftManagerContract.balanceOf(address(user2), 25);
        uint256 bal3 = nftManagerContract.balanceOf(address(user3), 25);
        uint256 bal4 = nftManagerContract.balanceOf(address(user4), 25);

        console.log(bal1, bal2, bal3, bal4);

        vm.startPrank(user1);
        nftManagerContract.safeTransferFrom(user1, user2, 25, 1, bytes(""));

        uint256 bal1_2 = nftManagerContract.balanceOf(address(user1), 25);
        uint256 bal2_2 = nftManagerContract.balanceOf(address(user2), 25);

        console.log(bal1_2, bal2_2);
    }
}
