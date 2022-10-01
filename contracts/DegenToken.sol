// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DegenToken is ERC20 {

    address owner;

    uint public constant maxTotalSupply = 10000000 * 10 ** 18;

    constructor() ERC20("Degen Gas", "DEG") {}

    function mint(uint _amount) public {
        _mint(msg.sender, _amount);
    }
}