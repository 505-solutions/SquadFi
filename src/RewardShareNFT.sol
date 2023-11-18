// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

import "./interfaces/ISplitMain.sol";

contract RewardShareNFT is ERC1155URIStorage, Ownable, ERC1155Burnable {
    mapping(uint256 => address) s_feeSplitter; // validatorId -> spliter address
    mapping(uint256 => address[]) public s_validatorSplitFeeAddresses; // validator ID -> fee addresses
    mapping(uint256 => uint32[]) public s_validatorSplitFeePercentages; // validator ID -> fee percentage

    // maps the user to all the validators where he has specific percentages
    mapping(address => mapping(uint256 => uint256[])) s_userFeeShares; // user => id(=percentage) -> validatorIds

    address immutable spliterAddress;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        spliterAddress = _spliterAddress;
    }

    uint256 constant spliterScaleFactor = 1000000;

    function setURI(
        uint256[] memory tokenIds,
        string[] memory newuris
    ) public onlyOwner {
        require(tokenIds.length <= newuris.length, "not enough uris");

        for (uint i = 0; i < tokenIds.length; i++) {
            _setURI(tokenIds[i], newuris[i]);
        }
    }

    function mintBatch(
        uint256 validatorId,
        address[] feeRecipients,
        uint32[] feePercentages
    ) public onlyOwner {
        require(
            s_validatorSplitFeeAddresses[validatorId].length == 0,
            "batch already minted"
        );

        for (uint i = 0; i < feeRecipients.length; i++) {
            address feeRecipient = feeRecipients[i];
            uint32 id = feePercentages[i] / spliterScaleFactor;

            _mint(feeRecipient, id, 1, data);

            addToStorageArray(s_userFeeShares[feeRecipient][id], validatorId);
        }
        s_validatorSplitFeeAddresses[validatorId] = feeRecipients;
        s_validatorSplitFeePercentages[validatorId] = feePercentages;

        address newSpliterAddress = ISplitMain(spliterAddress).createSplit(
            feeRecipients,
            feePercentages,
            0,
            address(this)
        );
        s_feeSplitter[validatorId] = newSpliterAddress;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override onlyOwner {
        address sender = _msgSender();
        if (from != sender && !isApprovedForAll(from, sender)) {
            revert ERC1155MissingApprovalForAll(sender, from);
        }

        internalTransferUpdates(from, to, id, amount);

        _safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public override onlyOwner {
        address sender = _msgSender();
        if (from != sender && !isApprovedForAll(from, sender)) {
            revert ERC1155MissingApprovalForAll(sender, from);
        }

        for (uint i = 0; i < ids.length; i++) {
            internalTransferUpdates(from, to, ids[i], values[i]);
        }

        _safeBatchTransferFrom(from, to, ids, values, data);
    }

    // * HELPERS ============================================================

    function internalTransferUpdates(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) {
        uint256 count = 0;
        while (count < amount) {
            uint256 validatorId;
            for (uint i = 0; i < s_userFeeShares[from][id].length; i++) {
                validatorId = s_userFeeShares[from][id][i];

                if (validatorId != 0) {
                    updateUserShare(validatorId, from, to, id);

                    count++;
                    delete s_userFeeShares[from][id][i];

                    break;
                }
            }
        }
    }

    function updateUserShare(
        uint256 validatorId,
        address from,
        address to,
        uint256 id
    ) private {
        // ? Get the last splitter address of from
        address validatorSplitAddr = s_feeSplitter[validatorId];

        address[] storage feeAddresses = s_validatorSplitFeeAddresses[
            validatorId
        ];
        address[] memory feePercentages = s_validatorSplitFeePercentages[
            validatorId
        ];

        for (uint256 i = 0; i < feeAddresses.length; i++) {
            if (feeAddresses[i] == from) {
                require(
                    feePercentages == id * spliterScaleFactor,
                    "invalid id"
                );
                feeAddresses[i] = to;
            }
        }

        // ? Remove the validatorId from the userFeeShares of from and add it to the userFeeShares of to
        removeToStorageArray(s_userFeeShares[from][id], validatorId);
        addToStorageArray(s_userFeeShares[to][id], validatorId);

        ISplitMain(spliterAddress).updateSplits(
            validatorSplitAddr,
            feeAddresses,
            feePercentages,
            0
        );
    }

    function splitFeeDenominations(
        uint256 amount
    ) external pure returns (uint256[4] memory) {
        require(amount > 0, "Amount must be greater than 0");

        uint256[] memory denominations = new uint256[](4);

        // Calculate the number of 10s
        denominations[0] = uint256(amount / (10 * spliterScaleFactor));
        amount = amount % (10 * spliterScaleFactor);

        // Calculate the number of 5s
        denominations[1] = uint256(amount / (5 * spliterScaleFactor));
        amount = amount % (5 * spliterScaleFactor);

        // Calculate the number of 2s
        denominations[2] = uint256(amount / (2 * spliterScaleFactor));
        amount = amount % (2 * spliterScaleFactor);

        // The remaining amount is the number of 1s
        denominations[3] = uint256(amount / (1 * spliterScaleFactor));

        return denominations;
    }

    function addToStorageArray(
        uint256[] storage storage_array,
        uint256 element
    ) {
        // ? Replace one of the zero values in the array or add a new element
        bool added = false;
        for (uint i = 0; i < storage_array.length; i++) {
            if (storage_array[i] == 0) {
                storage_array[i] = element;
                added = true;
                break;
            }
        }
        if (!added) {
            storage_array.push(element);
        }
    }

    function removeToStorageArray(
        uint256[] storage storage_array,
        uint256 element
    ) {
        if (storage_array[storage_array.length - 1] = element) {
            storage_array.pop();
            return;
        }

        for (uint i = 0; i < storage_array.length; i++) {
            if (storage_array[i] == element) {
                delete storage_array[i];
                return;
            }
        }
    }
}
