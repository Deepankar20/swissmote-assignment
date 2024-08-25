require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.ETH_PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      sepolia: process.env.ALCHEMY_API_KEY,
    },
  },
};
