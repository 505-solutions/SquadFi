// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract RewardShareNFT is ERC1155, Ownable, ERC1155Burnable {
    mapping(address => mapping(uint256 => address[])) public s_userShares; // user > nftIn > splitAddress

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        address splitsContract,
        bytes memory data
    ) public onlyOwner {
        // TODO: This should be called together with createSplit

        s_userShares[account][id].push(splitsContract);

        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        address[] memory splitsContractes,
        bytes memory data
    ) public onlyOwner {
        // TODO: This should be called together with createSplit

        for (uint i = 0; i < ids.length; i++) {
            s_userShares[to][ids[i]].push(splitsContractes[i]);
        }

        _mintBatch(to, ids, amounts, data);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override onlyOwner {
        // TODO: This should updateSplits in the SplitMain contract

        address sender = _msgSender();
        if (from != sender && !isApprovedForAll(from, sender)) {
            revert ERC1155MissingApprovalForAll(sender, from);
        }

        for (uint i = 0; i < ids.length; i++) {
            s_userShares[to][ids[i]].push(splitsContractes[i]);
        }

        _safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        address[] memory splitsContractes,
        bytes memory data
    ) public onlyOwner {
        // TODO: This should updateSplits in the SplitMain contract

        address sender = _msgSender();
        if (from != sender && !isApprovedForAll(from, sender)) {
            revert ERC1155MissingApprovalForAll(sender, from);
        }

        _safeTransferFrom(from, to, id, amount, data);
    }
}

// balanceOf(account, id)

// balanceOfBatch(accounts, ids)

// setApprovalForAll(operator, approved)

// isApprovedForAll(account, operator)

// safeTransferFrom(from, to, id, value, data)

// safeBatchTransferFrom(from, to, ids, values, data)
