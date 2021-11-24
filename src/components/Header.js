import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
const Header = () => {

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
        <Navbar collapseOnSelect expand="lg" variant="light">
            <Container>
                <Link to="/">
                    <img src={require('../assets/img/nifty.svg').default} />
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="https://twitter.com/nifty_io">
                            {/* <span>Twitter</span> */}
                            <img src={require('../assets/img/twitter.svg').default} alt="Twitter icon" />
                        </Nav.Link>
                        <Nav.Link href="https://discord.com/invite/nifty">
                            {/* <span>Discord</span> */}
                            <img src={require('../assets/img/discord.svg').default} alt="Discord icon" />
                        </Nav.Link>
                        <Nav.Link href="https://opensea.io/collection/nodestones">
                            {/* <span>Opensea</span> */}
                            <img src={require('../assets/img/opensea.svg').default} alt="Opensea icon" />
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link>
                            <Button variant="light" id="connect-wallet" onClick={walletConnect}>{walletAddress ? walletAddress : 'Connect Wallet'}</Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;