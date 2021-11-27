import './App.scss';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Project from './pages/Project';
import Proposal from './pages/Proposal';
import Outside from './pages/Outside';
import Web3 from 'web3';
import { database } from './config/firebase';
import { useState, useEffect } from 'react';

function App() {
  
  const [walletAddress, setAddress] = useState('');
  const [userInfo, setUserInfo] = useState({})
  const [userLoad, setUserLoad] = useState(false) 
    
  useEffect( () => {
      walletConnect()
  }, [walletAddress, userInfo ? userInfo.username : userInfo] )

  const walletConnect = async () => {
      if(window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          const account = await window.web3.eth.getAccounts()
          setAddress(account[0])
          if(account[0]) {
            getUserInfo(account[0])
          }
      } else if(window.web3) {
          window.web3 = new Web3(window.web3.currentProvider) 
          const account = await window.web3.eth.getAccounts()
          setAddress(account[0])
          if(account[0]) {
            getUserInfo(account[0])
          }
      } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
  }

  const getUserInfo = (accountAddress) => {
    const userRef = database.ref('member_profile')
    userRef.get().then( (snapshot) => {
      if(snapshot.exists) {
        const newAry = snapshot.val()
        if(newAry) {
            for(let i in newAry) {
                let data = newAry[i]
                if(data.wallet == accountAddress) {
                  data.id = i
                  setUserInfo(data)
                  break
                }
            }
            setUserLoad(true)
        }
    }
    })
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} />} />
        <Route path="project/:id/:t" element={<Project walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} />} />
        <Route path="proposal" element={<Proposal walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} />} />
        <Route path="outside" element={<Outside walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
