const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const hre = require("hardhat");

function encodeLeaf(address: any, spots: any) {
  // Same as `abi.encodePacked` in Solidity
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint64"],
    [address, spots]
  );
}

describe("Check if merkle root is working", function () {
  it("Should be able to verify if a given address is in whitelist or not", async function () {

    // const boredApeHolder = "0x758c32B770d656248BA3cC222951cF1aC1DdDAaA";
    // await hre.network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: [boredApeHolder],
    // });
    
    // Create an array of elements you wish to encode in the Merkle Tree
    const list = [
      encodeLeaf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 100),
      encodeLeaf("0x978eb4bef0a31f9e582f194a72cff24f0d6cd821", 100),
      encodeLeaf("0x624b6e2ee9a60ab1f525cd253debaa20bd88336d", 100),
      encodeLeaf("0x8b77925bbdef4a09550bc5b21009ff007b05e242", 100),
      encodeLeaf("0x5d0828d54685d22adb6089a0398841d1143fb102", 100),
      encodeLeaf("0x8d757d94a110edf1cea65c19790415050e404566", 100),
      encodeLeaf("0x95f209735f386455334099021d8ab360f1e5046c", 100),
      encodeLeaf("0xc02b594f40fd06785bfa94a245340bb964a877ae", 100),
      encodeLeaf("0x0a01b55e847d1f232dcd65822ad5a2133bcb96ce", 100),
      encodeLeaf("0xb90b5dcab4b7434c6e98b9648b4f6259d49d8437", 100),
      encodeLeaf("0xe3d9d29710b10bcc663a3072c03617354f736284", 100),
      encodeLeaf("0xd051c77dd1c94b34143cc90ecdf13f793631ab00", 100),
    ];

    const merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true, // this makes the leafs even (2 ** n)
    });

    const root = merkleTree.getHexRoot();

    const whitelist = await ethers.getContractFactory("Whitelist");
    const Whitelist = await whitelist.deploy(root);
    await Whitelist.deployed();

    const leaf = keccak256(list[0]);
    const proof = merkleTree.getHexProof(leaf);

    let verified = await Whitelist.checkInWhitelist(proof, 100);
    expect(verified).to.equal(true);
    
    verified = await Whitelist.checkInWhitelist([], 100);
    expect(verified).to.equal(false);
  });
});