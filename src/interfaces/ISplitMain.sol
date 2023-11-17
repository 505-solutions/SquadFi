// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

// import {address} from "@rari-capital/solmate/src/tokens/address.sol";

/**
 * @title ISplitMain
 * @author 0xSplits <will@0xSplits.xyz>
 */
interface ISplitMain {
    /**
     * FUNCTIONS
     */

    function walletImplementation() external returns (address);

    function createSplit(
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee,
        address controller
    ) external returns (address);

    function predictImmutableSplitAddress(
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee
    ) external view returns (address);

    function updateSplit(
        address split,
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee
    ) external;

    function transferControl(address split, address newController) external;

    function cancelControlTransfer(address split) external;

    function acceptControl(address split) external;

    function makeSplitImmutable(address split) external;

    function distributeETH(
        address split,
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee,
        address distributorAddress
    ) external;

    function updateAndDistributeETH(
        address split,
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee,
        address distributorAddress
    ) external;

    function distributeaddress(
        address split,
        address token,
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee,
        address distributorAddress
    ) external;

    function updateAndDistributeaddress(
        address split,
        address token,
        address[] calldata accounts,
        uint32[] calldata percentAllocations,
        uint32 distributorFee,
        address distributorAddress
    ) external;

    function withdraw(
        address account,
        uint256 withdrawETH,
        address[] calldata tokens
    ) external;

    /**
     * EVENTS
     */

    /** @notice emitted after each successful split creation
     *  @param split Address of the created split
     */
    event CreateSplit(address indexed split);

    /** @notice emitted after each successful split update
     *  @param split Address of the updated split
     */
    event UpdateSplit(address indexed split);

    /** @notice emitted after each initiated split control transfer
     *  @param split Address of the split control transfer was initiated for
     *  @param newPotentialController Address of the split's new potential controller
     */
    event InitiateControlTransfer(
        address indexed split,
        address indexed newPotentialController
    );

    /** @notice emitted after each canceled split control transfer
     *  @param split Address of the split control transfer was canceled for
     */
    event CancelControlTransfer(address indexed split);

    /** @notice emitted after each successful split control transfer
     *  @param split Address of the split control was transferred for
     *  @param previousController Address of the split's previous controller
     *  @param newController Address of the split's new controller
     */
    event ControlTransfer(
        address indexed split,
        address indexed previousController,
        address indexed newController
    );

    /** @notice emitted after each successful ETH balance split
     *  @param split Address of the split that distributed its balance
     *  @param amount Amount of ETH distributed
     *  @param distributorAddress Address to credit distributor fee to
     */
    event DistributeETH(
        address indexed split,
        uint256 amount,
        address indexed distributorAddress
    );

    /** @notice emitted after each successful address balance split
     *  @param split Address of the split that distributed its balance
     *  @param token Address of address distributed
     *  @param amount Amount of address distributed
     *  @param distributorAddress Address to credit distributor fee to
     */
    event Distributeaddress(
        address indexed split,
        address indexed token,
        uint256 amount,
        address indexed distributorAddress
    );

    /** @notice emitted after each successful withdrawal
     *  @param account Address that funds were withdrawn to
     *  @param ethAmount Amount of ETH withdrawn
     *  @param tokens Addresses of addresss withdrawn
     *  @param tokenAmounts Amounts of corresponding addresss withdrawn
     */
    event Withdrawal(
        address indexed account,
        uint256 ethAmount,
        address[] tokens,
        uint256[] tokenAmounts
    );
}
