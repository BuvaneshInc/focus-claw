// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal public timestamp anchor for a precomputed consent receipt hash.
/// @dev Never store personal data, message data, contact identifiers, or reversible hashes on-chain.
///      This contract is a prototype and has not been audited.
contract ConsentAnchor {
    mapping(bytes32 => uint256) public anchoredAt;
    event Anchored(bytes32 indexed receiptHash, uint256 timestamp, address indexed anchorer);

    error EmptyReceiptHash();
    error AlreadyAnchored();

    function anchor(bytes32 receiptHash) external {
        if (receiptHash == bytes32(0)) revert EmptyReceiptHash();
        if (anchoredAt[receiptHash] != 0) revert AlreadyAnchored();
        anchoredAt[receiptHash] = block.timestamp;
        emit Anchored(receiptHash, block.timestamp, msg.sender);
    }
}
