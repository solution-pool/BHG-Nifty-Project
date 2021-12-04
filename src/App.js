import './App.scss';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Project from './pages/Project';
import Proposal from './pages/Proposal';
import Outside from './pages/Outside';
import Profile from './pages/Profile';
import Web3 from 'web3';
import { database } from './config/firebase';
import { useState, useEffect } from 'react';

function App() {
  
  const [walletAddress, setAddress] = useState('');
  const [userInfo, setUserInfo] = useState({})
  const [userLoad, setUserLoad] = useState(false) 
  const [reload, setReload] = useState(false)
    
  useEffect( async () => {
    await walletConnect()
  }, [walletAddress, userInfo ? userInfo.username : userInfo, reload] )

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

  const changeReload = (e) => {
    setReload(e)
  }

  const changeUserLoad = (e) => {
    setUserLoad(e)
  }

  const getUserInfo = (accountAddress) => {
    const userRef = database.ref('member_profile')
    userRef.get().then( (snapshot) => {
      if(snapshot.exists()) {
        const newAry = snapshot.val()
        if(newAry) {
          let existUser = false
            for(let i in newAry) {
                let data = newAry[i]
                if(data.wallet == accountAddress) {
                  data.id = i
                  existUser = true
                  setUserInfo(data)
                  setUserLoad(true)
                  break
                }
            }

            if(!existUser) {
              setUserLoad(-1)
            }
        } else {
          setUserLoad(-1)
        }
        
      } else {
        setUserLoad(-1)
      }
    }).catch(e => {
      setUserLoad(-2)
    })
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />} />
        <Route path="/:t" element={<Home walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />} />
        <Route path="project/:id/:t" element={<Project walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />} />
        <Route path="proposal" element={<Proposal walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />}  />
        <Route path="proposal/:id" element={<Proposal walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />} />
        <Route path="outside" element={<Outside walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />}/>      
        <Route path="outside/:id" element={<Outside walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} />} />      
        <Route path="profile" element={<Profile walletConnect={walletConnect} walletAddress={walletAddress} userInfo={userInfo} userLoad={userLoad} reload={reload} changeReload={changeReload} changeUserLoad={changeUserLoad} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
