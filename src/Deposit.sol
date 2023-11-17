// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/ISplitMain.sol";

contract SquadDeposits {
    struct ValidatorInfo {
        address[] feeAddresses;
        uint32[] percentAllocations;
        address signer; // the multisig to sign the deposit-data.json
    }

    mapping(uint256 => ValidatorInfo) s_registeredValidators;
    mapping(uint256 => bool) public s_isValidatorActive;

    mapping(address => mapping(uint256 => uint256))
        public s_validatorContributions;
    mapping(uint256 => uint256) public s_validatorTotalContributions;

    mapping(address => uint256[]) public s_userContributedTo;
    mapping(uint256 => address[]) public s_validatorContributors;

    address immutable spliterAddress;

    constructor(address _spliterAddress) {
        spliterAddress = _spliterAddress;
    }

    // ! Make a contribution to a validator
    function contributeToValidator(uint256 validatorId) external payable {
        uint256 totalContributions = s_validatorTotalContributions[validatorId];

        s_validatorContributors[validatorId].push(msg.sender);

        if (totalContributions + msg.value > 32 ether) {
            uint256 depositAmount = 32 ether - totalContributions;
            uint256 refundAmount = totalContributions + msg.value - 32 ether;

            payable(msg.sender).transfer(refundAmount);

            s_validatorContributions[msg.sender][validatorId] += depositAmount;

            s_userContributedTo[msg.sender].push(validatorId);
        } else {
            s_validatorContributions[msg.sender][validatorId] += msg.value;

            s_userContributedTo[msg.sender].push(validatorId);
        }
    }

    // ! cancel pending contribution
    function cancelContribution(uint256 validatorId) external {
        uint256 amount = s_validatorContributions[msg.sender][validatorId];
        s_validatorContributions[msg.sender][validatorId] = 0;

        uint256[] storage contributionsArray = s_userContributedTo[msg.sender];
        for (uint256 i = 0; i < contributionsArray.length; i++) {
            if (contributionsArray[i] == validatorId) {
                contributionsArray[i] = 0;
            }
        }

        address[] storage contributors = s_validatorContributors[validatorId];
        for (uint256 i = 0; i < contributors.length; i++) {
            if (contributors[i] == msg.sender) {
                contributors[i] = 0;
            }
        }

        payable(msg.sender).transfer(amount);
    }

    //
    // ! register validator (link deposit-data.json and multisig)
    function registerValidator(
        uint256 validatorId,
        address[] calldata feeAddresses,
        uint32[] calldata percentAllocations,
        address signer // ideally a gnosis safe multisig
    ) external {
        // TODO: Get all the signers from the gnosis multisig

        require(feeAddresses.length >= 1, "must have at least one fee address");
        require(
            feeAddresses.length == percentAllocations.length,
            "must have the same number of fee addresses and percent allocations"
        );

        s_registeredValidators[validatorId] = ValidatorInfo({
            feeAddresses: feeAddresses,
            percentAllocations: percentAllocations,
            signer: signer
        });
    }

    // ! Activate validator
    function activateValidator(
        uint256 validatorId,
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) public {
        require(
            s_isValidatorActive[validatorId] == false,
            "validator already active"
        );

        uint256 totalContributions = s_validatorTotalContributions[validatorId];

        require(totalContributions >= 32 ether, "invalid stake amount");

        ValidatorInfo memory validatorInfo = s_registeredValidators[
            validatorId
        ];

        require(validatorInfo.signer == msg.sender, "invalid signer");

        // ? Set the fee splitter controller to the signer
        (
            uint256[] memory feeRecipients,
            uint32[] memory feePercentages
        ) = splitValidatorFees(validatorId, validatorInfo);

        address newSpliterAddress = ISplitMain(spliterAddress).createSplit(
            feeRecipients,
            feePercentages,
            0,
            address(0)
        );

        // address[] feeAddresses;
        // uint32[] percentAllocations;

        // TODO: Mint the validator reward NFTs

        // TODO: ACTIVATE THEVALIDATOR !!!
    }

    function splitValidatorFees(
        uint256 validatorId,
        ValidatorInfo memory validatorInfo
    )
        private
        pure
        returns (uint256[] memory feeRecipients, uint32[] memory feePercentages)
    {
        feeRecipients = new uint256[]();
        feePercentages = new uint256[]();

        uint32 validatorNodePercentageSum = 0;
        for (uint i = 0; i < validatorInfo.percentAllocations.length; i++) {
            uint32 feePercentage = validatorInfo.percentAllocations[i];
            validatorNodePercentageSum += feePercentage;
        }

        uint256 percentageScaleFactor = ISplitMain(spliterAddress)
            .PERCENTAGE_SCALE_FACTOR();
        uint256 distributablePercentage = 100 *
            percentageScaleFactor -
            validatorNodePercentageSum;

        for (
            uint256 i = 0;
            i < s_validatorContributors[validatorId].length;
            i++
        ) {
            address contributor = s_validatorContributors[validatorId][i];
            uint256 contributionAmount = s_validatorContributions[contributor][
                validatorId
            ];

            if (contributionAmount == 0) {
                continue;
            }

            uint32 contributorPercentage = (distributablePercentage *
                contributionAmount) / 32 ether;

            feeRecipients.push(contributor);
            feePercentages.push(contributorPercentage);
        }

        // ? Add the validatorInfo.feePercentages to the fee recipients
        for (uint i = 0; i < validatorInfo.feeAddresses; i++) {
            address feeRecipient = validatorInfo.feeAddresses[i];
            uint32 feePercentage = validatorInfo.percentAllocations[i];

            int256 idx = indexOf(feeRecipient, feeRecipients);
            if (idx == -1) {
                feeRecipients.push(feeRecipient);
                feePercentages.push(feePercentage);
            } else {
                feePercentages[idx] += feePercentage;
            }
        }
    }

    function indexOf(
        uint256 value,
        uint256[] memory array
    ) external pure returns (int256) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                // Return the index when the value is found
                return int256(i);
            }
        }

        // Return -1 if the value is not found
        return -1;
    }

    // * GETTERS ===========================================================

    function getUserContributions(
        address user
    ) public view returns (uint256[] memory) {
        return s_userContributedTo[user];
    }

    function getValidatorInfo(
        uint256 validatorId
    ) external view returns (ValidatorInfo memory) {
        require(
            s_registeredValidators[validatorId].feeAddresses.length > 0,
            "Validator not registered"
        );

        return s_registeredValidators[validatorId];
    }

    //
}
