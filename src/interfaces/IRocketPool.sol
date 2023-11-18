// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IRocketNodeDeposit {
    function deposit(
        uint256 _bondAmount,
        uint256 _minimumNodeFee,
        bytes calldata _validatorPubkey,
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot,
        uint256 _salt,
        address _expectedMinipoolAddress
    ) external payable;
}

interface IRocketNodeManager {
    function registerNode(string calldata _timezoneLocation) external;
}
