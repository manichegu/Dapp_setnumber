import { useState, useEffect } from "react";
import { JsonRpcProvider, Contract, Wallet } from "ethers";

const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/TulsDSme8scVD1cxLptaX7kWmS4IqEE7"; // Anvil RPC URL
const PRIVATE_KEY = "054348cfcc07a224d5c20479e173269d965cdbe0f08874d001399cf652b2a4d5"; // Replace with your private key from Anvil
const CONTRACT_ADDRESS = "0x58353A720386F97d8f1d95B4836667e835A64ae1"; // Deployed contract address

const contractABI = [
  {
    "type": "function",
    "name": "getNumber",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setNumber",
    "inputs": [
      {
        "name": "_number",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "NumberUpdated",
    "inputs": [
      {
        "name": "newNumber",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];

function App() {
  const [number, setNumber] = useState(0);
  const [newNumber, setNewNumber] = useState("");
  const [contract, setContract] = useState(null);
  
  useEffect(() => {
    const loadContract = async () => {
      const provider = new JsonRpcProvider(RPC_URL);
      const wallet = new Wallet(PRIVATE_KEY, provider);
      const contractInstance = new Contract(CONTRACT_ADDRESS, contractABI, wallet);
      setContract(contractInstance);
      fetchStoredNumber(contractInstance);
    };
    loadContract();
  }, []);

  const fetchStoredNumber = async (contract) => {
    try {
      // console.log("hello!");
      const storedNumber = await contract.getNumber();
      // console.log("hello!!");
      setNumber(Number(storedNumber));
    } catch (error) {
      console.error("Error fetching number:", error);
    }
  };

  const updateNumber = async () => {
    if (contract) {
      try {
        const tx = await contract.setNumber(newNumber);
        await tx.wait();
        fetchStoredNumber(contract);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Simple Storage dApp (Direct RPC)</h1>
      <p>Stored Number: {number}</p>
      <input type="number" onChange={(e) => setNewNumber(Number(e.target.value))} />
      <button onClick={updateNumber}>Set Number</button>
    </div>
  );
}

export default App;
