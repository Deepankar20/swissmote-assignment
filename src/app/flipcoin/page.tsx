"use client";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

const FlipCoin = () => {
  const [betAmount, setBetAmount] = useState("");
  const [side, setSide] = useState("");
  const [result, setResult] = useState("");
  const providerUrl = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

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
        if (player.toLowerCase() === account.toLowerCase()) {
          setResult(won ? "You won the coin flip!" : "You lost the coin flip.");
        }
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
      <div className="flex flex-col justify-center mx-auto">
        <input
          type="text"
          placeholder="Bet Amount (ETH)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="text-black p-4"
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
          className="bg-black"
        >
          <option value="">Select Side</option>
          <option value="Heads">Heads</option>
          <option value="Tails">Tails</option>
        </select>
        <button onClick={flipCoin}>Flip Coin</button>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default FlipCoin;
