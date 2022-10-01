// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./DegenToken.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Whitelist is DegenToken {

    bytes32 public merkleRoot;

    mapping(address => bool) claimed;
    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkInWhitelist(bytes32[] calldata proof, uint64 maxAllowanceToMint) public {
        bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint));
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);

        // return verified;

        if(verified) {
            require(!claimed[msg.sender], "Already claimed");
            
            mint(maxAllowanceToMint);

            claimed[msg.sender] = true;
        }
    }

    function checkClaimed(address _address) external view returns (bool) {
        return claimed[_address];
    }
}