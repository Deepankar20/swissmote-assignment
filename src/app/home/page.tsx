'use client'
import { useState, useEffect } from "react";
import { JsonRpcSigner, ethers } from "ethers";
import { useRouter } from "next/navigation";

const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<JsonRpcSigner | string>();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
          setProvider(provider);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setIsConnected(true);
        setAccount(address);
        setProvider(provider);
        router.push("/flipcoin");
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount("");
    setProvider(null);
  };

  return (
    <div>
      <h1>Connect Wallet</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <p>Wallet Connected: {account as string}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
