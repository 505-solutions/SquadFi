// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {OptimisticWithdrawalRecipient} from "./Owr.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IReverseRegistar.sol";
import "../interfaces/IENS.sol";

import "forge-std/console.sol";

contract OptimisticWithdrawalRecipientFactory is Ownable {
    /// Invalid number of recipients, must be 2
    error Invalid__Recipients();

    /// Thresholds must be positive
    error Invalid__ZeroThreshold();

    /// Invalid threshold at `index`; must be < 2^96
    /// @param threshold threshold of too-large threshold
    error Invalid__ThresholdTooLarge(uint256 threshold);

    event CreateOWRecipient(
        address indexed owr,
        address recoveryAddress,
        address principalRecipient,
        uint256 threshold,
        bytes32 subnode
    );

    event RegisterRewardRecipient(address rewardRecipient);

    uint256 internal constant ADDRESS_BITS = 160;

    bytes32 parentEnsNode;
    address ensRegistar;
    address depositContract;

    constructor(
        address initialOwner,
        address _depositContract,
        string memory _ensName,
        address _ensReverseRegistrar,
        address _ensOwner,
        address _ensRegistar
    ) Ownable(initialOwner) {
        depositContract = _depositContract;

        parentEnsNode = IENSReverseRegistrar(_ensReverseRegistrar).setName(
            _ensName
        );
        IENSReverseRegistrar(_ensReverseRegistrar).claim(_ensOwner);

        ensRegistar = _ensRegistar;
    }

    function createOWRecipient(
        address recoveryAddress,
        address principalRecipient,
        uint256 amountOfPrincipalStake,
        address validatorSigner,
        bytes32 subdomainLabel
    ) external returns (address owrAddress) {
        /// checks

        // ensure doesn't have address(0)
        if (principalRecipient == address(0)) revert Invalid__Recipients();
        // ensure threshold isn't zero
        if (amountOfPrincipalStake == 0) revert Invalid__ZeroThreshold();
        // ensure threshold isn't too large
        if (amountOfPrincipalStake > type(uint96).max)
            revert Invalid__ThresholdTooLarge(amountOfPrincipalStake);

        OptimisticWithdrawalRecipient owr = new OptimisticWithdrawalRecipient(
            recoveryAddress,
            principalRecipient,
            amountOfPrincipalStake,
            address(this)
        );
        owrAddress = address(owr);

        bytes32 subnode = IENS(ensRegistar).setSubnodeOwner(
            parentEnsNode,
            subdomainLabel,
            validatorSigner
        );

        emit CreateOWRecipient(
            address(owr),
            recoveryAddress,
            principalRecipient,
            amountOfPrincipalStake,
            subnode
        );
    }

    function setRewardRecipient(
        address owrAddress,
        address rewardRecipient
    ) external {
        require(msg.sender == depositContract, "unauthorized access atempt");

        // ensure doesn't have address(0)
        if (rewardRecipient == address(0)) revert Invalid__Recipients();

        OptimisticWithdrawalRecipient(owrAddress).setRewardRecipient(
            rewardRecipient
        );

        emit RegisterRewardRecipient(rewardRecipient);
    }
}
