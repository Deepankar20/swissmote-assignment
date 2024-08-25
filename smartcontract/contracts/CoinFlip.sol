// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    enum Side { Heads, Tails }

    event CoinFlipped(address indexed player, uint256 amount, Side choice, bool won);

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    function flipCoin(Side choice) external payable {
        require(msg.value > 0, "You need to bet some ether");

        // Determine the result of the coin flip
        Side result = random() == 0 ? Side.Heads : Side.Tails;
        bool won = (choice == result);

        if (won) {
            uint256 payout = msg.value * 2;
            require(address(this).balance >= payout, "Not enough balance in contract");
            payable(msg.sender).transfer(payout);
        }

        emit CoinFlipped(msg.sender, msg.value, choice, won);
    }

    function random() private view returns (uint8) {
        // A very simple random function (not suitable for production)
        return uint8(block.timestamp % 2);
    }

    // Function to withdraw contract balance by owner
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to accept ETH deposits
    receive() external payable {}
}
