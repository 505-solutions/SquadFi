// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/ISplitMain.sol";
import "./interfaces/IRocketPool.sol";
import "./interfaces/IDepositContract.sol";

import "./obolOwr/OwrFactory.sol";
import "./RewardShareNFT.sol";

import "forge-std/console.sol";

contract SquadFiDeposits is Ownable {
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

    mapping(uint256 => address) public s_validatorOwr;
    mapping(uint256 => address) public s_validatorFeeSplitter;

    address owrFactory;
    address nftManager;

    uint256 internal constant ETH_DEPOSIT = 0;
    uint256 internal constant ROCKETPOOL = 1;
    uint256 internal constant STAKEWISE = 2;

    address ethDepositContract;
    address rocketNodeManager;
    address rocketNodeDeposit;

    uint256 constant spliterScaleFactor = 1000000;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setOwrFactory(address _owrFactory) external onlyOwner {
        owrFactory = _owrFactory;
    }

    function setNftManager(address _nftManager) external onlyOwner {
        nftManager = _nftManager;
    }

    function setRocketNodeManager(
        address _rocketNodeManager
    ) external onlyOwner {
        rocketNodeManager = _rocketNodeManager;
    }

    function setRocketNodeDeposit(
        address _rocketNodeDeposit
    ) external onlyOwner {
        rocketNodeDeposit = _rocketNodeDeposit;
    }

    function setEthDepositContract(
        address _ethDepositContract
    ) external onlyOwner {
        ethDepositContract = _ethDepositContract;
    }

    // ! Make a contribution to a validator
    function contributeToValidator(uint256 validatorId) external payable {
        uint256 totalContributions = s_validatorTotalContributions[validatorId];

        if (totalContributions >= 32 ether) {
            return;
        }

        // TODO: Verify the msg.value is in denomination of (1%)
        // TODO: This should account for the validators taking a fee

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

        s_validatorTotalContributions[validatorId] += msg.value;

        console.log(
            "totalContributions2 : %s",
            s_validatorTotalContributions[validatorId]
        );
    }

    // ! cancel pending contribution
    function cancelContribution(uint256 validatorId) external {
        console.log(
            "totalContributions : %s",
            s_validatorTotalContributions[validatorId]
        );

        uint256 amount = s_validatorContributions[msg.sender][validatorId];
        s_validatorContributions[msg.sender][validatorId] = 0;
        s_validatorTotalContributions[validatorId] -= amount;

        uint256[] storage contributionsArray = s_userContributedTo[msg.sender];
        for (uint256 i = 0; i < contributionsArray.length; i++) {
            if (contributionsArray[i] == validatorId) {
                contributionsArray[i] = 0;
            }
        }

        address[] storage contributors = s_validatorContributors[validatorId];
        for (uint256 i = 0; i < contributors.length; i++) {
            if (contributors[i] == msg.sender) {
                delete contributors[i];
            }
        }

        payable(msg.sender).transfer(amount);

        console.log(
            "totalContributions2 : %s",
            s_validatorTotalContributions[validatorId]
        );
    }

    //
    // ! register validator (link deposit-data.json and multisig)

    function registerValidator(
        uint256 validatorId,
        address[] calldata feeAddresses,
        uint32[] calldata percentAllocations,
        address signer, // ideally a gnosis safe multisig
        bytes32 subdomainLabel // uint256 depositType
    ) external {
        if (s_registeredValidators[validatorId].signer != address(0)) {
            return;
        }

        require(feeAddresses.length >= 1, "must have at least one fee address");
        require(
            feeAddresses.length == percentAllocations.length,
            "must have the same number of fee addresses and percent allocations"
        );

        require(signer != address(0), "signer cant be the zero address");

        address owr = OptimisticWithdrawalRecipientFactory(owrFactory)
            .createOWRecipient(
                address(this),
                address(this),
                32 ether,
                signer,
                subdomainLabel
            );

        s_validatorOwr[validatorId] = owr;

        s_registeredValidators[validatorId] = ValidatorInfo({
            feeAddresses: feeAddresses,
            percentAllocations: percentAllocations,
            signer: signer
        });

        // if (depositType == ROCKETPOOL) {
        //     IRocketNodeManager(rocketNodeManager).registerNode(("us-east-1"));
        // } else if (depositType == STAKEWISE) {
        //     // TODO
        // }
    }

    // ! Activate validator
    function activateValidator(
        uint256 validatorId,
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root // uint256 depositType
    ) external {
        if (s_isValidatorActive[validatorId] == true) {
            return;
        }
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
            address[] memory feeRecipients,
            uint32[] memory feePercentages
        ) = splitValidatorFees(validatorId, validatorInfo);

        address newSpliterAddress = RewardShareNFT(nftManager).mintBatch(
            validatorId,
            feeRecipients,
            feePercentages
        );
        s_validatorFeeSplitter[validatorId] = newSpliterAddress;

        address owrAddress = s_validatorOwr[validatorId];
        OptimisticWithdrawalRecipientFactory(owrFactory).setRewardRecipient(
            owrAddress,
            newSpliterAddress
        );

        // // TODO Activate validator by sending it to rocketpool or beacon chain
        // if (depositType == ROCKETPOOL) {
        //     IRocketNodeDeposit(rocketNodeManager).deposit(
        //         _bondAmount,
        //         _minimumNodeFee,
        //         _validatorPubkey,
        //         _validatorSignature,
        //         _depositDataRoot,
        //         _salt,
        //         _expectedMinipoolAddress
        //     );
        // } else if (depositType == STAKEWISE) {} else {
        //     IDepositContract(ethDepositContract).deposit(
        //         pubkey,
        //         withdrawal_credentials,
        //         signature,
        //         deposit_data_root
        //     );
        // }
    }

    // * HELPERS =================================================

    function splitValidatorFees(
        uint256 validatorId,
        ValidatorInfo memory validatorInfo
    ) private view returns (address[] memory, uint32[] memory) {
        uint32 validatorNodePercentageSum = 0;
        for (uint i = 0; i < validatorInfo.percentAllocations.length; i++) {
            uint32 feePercentage = validatorInfo.percentAllocations[i];
            validatorNodePercentageSum += feePercentage;
        }

        uint256 distributablePercentage = 100 *
            spliterScaleFactor -
            validatorNodePercentageSum;

        uint256 size_alloc = s_validatorContributors[validatorId].length +
            validatorInfo.feeAddresses.length;
        address[] memory feeRecipients = new address[](size_alloc);
        uint32[] memory feePercentages = new uint32[](size_alloc);
        uint count = 0;
        for (
            uint256 i = 0;
            i < s_validatorContributors[validatorId].length;
            i++
        ) {
            address contributor = s_validatorContributors[validatorId][i];
            uint256 contributionAmount = s_validatorContributions[contributor][
                validatorId
            ];

            if (contributor == address(0) && contributionAmount == 0) {
                continue;
            }

            uint32 contributorPercentage = uint32(
                (distributablePercentage * contributionAmount) / 32 ether
            );

            feeRecipients[count] = contributor;
            feePercentages[count] = contributorPercentage;
            count++;
        }

        // ? Add the validatorInfo.feePercentages to the fee recipients
        for (uint i = 0; i < validatorInfo.feeAddresses.length; i++) {
            address feeRecipient = validatorInfo.feeAddresses[i];
            uint32 feePercentage = validatorInfo.percentAllocations[i];

            int256 idx = indexOf(feeRecipient, feeRecipients);
            if (idx == -1) {
                feeRecipients[count] = feeRecipient;
                feePercentages[count] = feePercentage;
                count++;
            } else {
                feePercentages[uint(idx)] += feePercentage;
            }
        }

        return (feeRecipients, feePercentages);
    }

    function indexOf(
        address value,
        address[] memory array
    ) private pure returns (int256) {
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
