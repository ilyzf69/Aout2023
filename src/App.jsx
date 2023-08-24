import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Contract from './Contract';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [conjoint1, setConjoint1] = useState('');
  const [conjoint2, setConjoint2] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractAddress = '0x28E8344B9C3E210d0D71FDC3a0182ebC04d6450b'; // Replace with your contract address
          const contractABI = [{"inputs":[{"internalType":"address","name":"_conjoint1","type":"address"},{"internalType":"address","name":"_conjoint2","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"conjoint1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"conjoint2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"demanderDivorce","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"demanderMariage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"estDivorce","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"estMarie","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]; // Replace with your contract ABI

          const marriageContract = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContractInstance(marriageContract);

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      } else {
        console.error("Web3 not available");
      }
    };

    initWeb3();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Marriage Contract App</h1>
        {web3 && contractInstance ? (
          <Contract contractInstance={contractInstance} accounts={accounts} />
        ) : (
          <p>Web3 not connected</p>
        )}
      </header>
    </div>
  );
}

export default App;
