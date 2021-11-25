import './App.scss';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Project from './pages/Project';
import Proposal from './pages/Proposal';
import Outside from './pages/Outside';
import Web3 from 'web3';
import { useState, useEffect } from 'react';

function App() {
  
  const [walletAddress, setAddress] = useState('');
    
  useEffect( () => {
      walletConnect()
  } )

  const walletConnect = async () => {
      if(window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          setAddress(await window.web3.eth.getAccounts())
      } else if(window.web3) {
          window.web3 = new Web3(window.web3.currentProvider) 
          setAddress(await window.web3.eth.getAccounts())
      } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home walletConnect={walletConnect} walletAddress={walletAddress} />} />
        <Route path="project/:id/:t" element={<Project walletConnect={walletConnect} walletAddress={walletAddress} />} />
        <Route path="proposal" element={<Proposal walletConnect={walletConnect} walletAddress={walletAddress} />} />
        <Route path="outside" element={<Outside walletConnect={walletConnect} walletAddress={walletAddress} />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
