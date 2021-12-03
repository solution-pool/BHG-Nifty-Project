import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = (props) => {
    return (
        <Navbar collapseOnSelect expand="lg" variant="light">
            <Container>
                <Link to="/">
                    <img src={require('../assets/img/nifty.svg').default} />
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                {(props.noHeaderBack !== true) ? 
                (<Link to="/" className="back" id="collapse-back">&lt;&lt;-back to projects</Link>)
                : ''}
                <Link to="/profile">
                    <img id="avatar-image-collapse" src={props.userInfo.image ? props.userInfo.image : require('../assets/img/avatar.png').default} alt="User avatar" />
                </Link>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="https://twitter.com/nifty_io">
                            <span>Twitter</span>
                            <img src={require('../assets/img/twitter.svg').default} alt="Twitter icon" />
                        </Nav.Link>
                        <Nav.Link href="https://discord.com/invite/nifty">
                            <span>Discord</span>
                            <img src={require('../assets/img/discord.svg').default} alt="Discord icon" />
                        </Nav.Link>
                        <Nav.Link href="https://opensea.io/collection/nodestones">
                            <span>Opensea</span>
                            <img src={require('../assets/img/opensea.svg').default} alt="Opensea icon" />
                        </Nav.Link>
                        {(props.noHeaderBack !== true) ? 
                        (<Link to="/" className="back" id="expand-back">&lt;&lt;-back to projects</Link>)
                        : ''}
                        {/* <Nav.Link href="/">
                            &lt;&lt;-back to projects
                        </Nav.Link> */}
                    </Nav>
                    <Nav>
                        <Link to="/profile">
                            <img id="avatar-image-expand" src={props.userInfo.image ? props.userInfo.image : require('../assets/img/avatar.png').default} alt="User avatar" />
                        </Link>
                        <Button variant="light" id="connect-wallet" onClick={props.walletConnect}>{props.walletAddress ? props.walletAddress : 'Connect Wallet'}</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;