"use client";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import Image from "next/image";

const FlipCoin = () => {
  const [betAmount, setBetAmount] = useState("");
  const [side, setSide] = useState("");
  const [result, setResult] = useState("");
  const providerUrl = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [won, setWon] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function func() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = process.env
        .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
      const contractWithSigner = new Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(contractWithSigner);

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: any) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            console.log(account);
          }
        })
        .catch((error: any) => {
          console.error("User denied account access", error);
        });
    }

    func();
  }, [account]);

  useEffect(() => {
    if (contract && account) {
      //@ts-ignore
      const listener = (player, amount, choice, won) => {
        console.log("Event received:", player, amount, choice, won);
        setLoading(false);
        setWon(won ? "true" : "false");
      };

      contract.on("CoinFlipped", listener);

      // Clean up the event listener when the component unmounts or dependencies change
      return () => {
        contract.off("CoinFlipped", listener);
      };
    }
  }, [contract, account]);

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

  const flipCoin = async () => {
    if (providerUrl && side) {
      try {
        setLoading(true);
        setBetAmount("");
        setSide("");
        const sideVal = side === "Heads" ? 0 : 1;

        const tx = await contract?.flipCoin(sideVal, {
          value: ethers.parseEther(betAmount),
        });
        await tx.wait();
        setResult("Coin flipped successfully!");
      } catch (error) {
        console.error(error);
        setResult("Transaction failed!");
      }
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center mx-auto w-1/2 my-[10rem] gap-8 items-center">
        <input
          type="text"
          placeholder="Bet Amount (ETH)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="text-black p-4 rounded-lg w-[30rem]"
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
          className="bg-black border border-white p-4 rounded-lg  w-[30rem]"
        >
          <option value="">Select Side</option>
          <option value="Heads">Heads</option>
          <option value="Tails">Tails</option>
        </select>
        <button
          onClick={flipCoin}
          className="text-2xl text-black bg-white font-semibold border border-white rounded-xl p-2 w-[20rem] hover:bg-black hover:text-white"
        >
          Flip Coin
        </button>
        {loading && (
          <Image
            src={"https://i.giphy.com/3o7bu3XilJ5BOiSGic.webp"}
            alt=""
            width={50}
            height={50}
          />
        )}
        {won && (
          <div
            className={`${won == "true" ? "text-green-500" : "text-red-500"}`}
          >
            {won == "true" ? "You Won" : "You Lost"}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipCoin;
