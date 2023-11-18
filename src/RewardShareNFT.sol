// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/ISplitMain.sol";

import "forge-std/console.sol";

contract RewardShareNFT is ERC1155URIStorage, Ownable {
    mapping(uint256 => address) s_feeSplitter; // validatorId -> spliter address
    mapping(uint256 => address[]) public s_validatorSplitFeeAddresses; // validator ID -> fee addresses
    mapping(uint256 => uint32[]) public s_validatorSplitFeePercentages; // validator ID -> fee percentage

    // maps the user to all the validators where he has specific percentages
    mapping(address => mapping(uint256 => uint256[])) s_userFeeShares; // user => id(=percentage) -> validatorIds

    address immutable spliterAddress;
    address immutable depositContract;

    constructor(
        address initialOwner,
        address _spliterAddress,
        address _depositContract
    ) ERC1155("") Ownable(initialOwner) {
        spliterAddress = _spliterAddress;
        depositContract = _depositContract;
    }

    uint256 constant spliterScaleFactor = 1000000;

    function setURI(string memory baseUri) public onlyOwner {
        _setBaseURI(baseUri);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory _baseUri = uri(0);

        string memory _tokenId = Strings.toString(tokenId);

        return
            tokenId != 0
                ? string.concat(_baseUri, _tokenId)
                : super.uri(tokenId);
    }

    function mintBatch(
        uint256 validatorId,
        address[] memory feeRecipients,
        uint32[] memory feePercentages
    ) public returns (address newSpliterAddress) {
        require(msg.sender == depositContract);
        require(
            s_validatorSplitFeeAddresses[validatorId].length == 0,
            "batch already minted for this validator"
        );

        for (uint i = 0; i < feeRecipients.length; i++) {
            address feeRecipient = feeRecipients[i];
            if (feeRecipient == address(0)) continue;

            uint256 id = feePercentages[i] / spliterScaleFactor;
            console.log(feeRecipient, id);

            _mint(feeRecipient, id, 1, bytes(""));
            addToStorageArray(s_userFeeShares[feeRecipient][id], validatorId);
        }

        // balanceOf(address account, uint256 id)

        // s_validatorSplitFeeAddresses[validatorId] = feeRecipients;
        // s_validatorSplitFeePercentages[validatorId] = feePercentages;
        // newSpliterAddress = ISplitMain(spliterAddress).createSplit(
        //     feeRecipients,
        //     feePercentages,
        //     0,
        //     address(this)
        // );
        // s_feeSplitter[validatorId] = newSpliterAddress;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
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
    ) public override {
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
    ) private {
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
        uint32[] storage feePercentages = s_validatorSplitFeePercentages[
            validatorId
        ];

        for (uint256 i = 0; i < feeAddresses.length; i++) {
            if (feeAddresses[i] == from) {
                require(
                    feePercentages[i] == id * spliterScaleFactor,
                    "invalid id"
                );
                feeAddresses[i] = to;
            }
        }

        // ? Remove the validatorId from the userFeeShares of from and add it to the userFeeShares of to
        removeToStorageArray(s_userFeeShares[from][id], validatorId);
        addToStorageArray(s_userFeeShares[to][id], validatorId);

        ISplitMain(spliterAddress).updateSplit(
            validatorSplitAddr,
            feeAddresses,
            feePercentages,
            0
        );
    }

    function splitFeeDenominations(
        uint256 amount
    ) private pure returns (uint256[] memory denominations) {
        require(amount > 0, "Amount must be greater than 0");

        denominations = new uint256[](4);

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
    ) private {
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
    ) private {
        if (storage_array[storage_array.length - 1] == element) {
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
