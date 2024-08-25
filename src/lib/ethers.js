import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL
);
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum CoinFlip.Side",
        name: "choice",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "won",
        type: "bool",
      },
    ],
    name: "CoinFlipped",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "enum CoinFlip.Side",
        name: "choice",
        type: "uint8",
      },
    ],
    name: "flipCoin",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
);
