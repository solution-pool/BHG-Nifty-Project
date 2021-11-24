import { useState, useEffect, useRef } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Header from '../components/Header';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import Proposal from '../components/Proposal';

const Home = () => {
    const [sort, setSort] = useState(0)
    // const [proposals, setProposals] = useState([])
    // const [outsides, setOutsides] = useState([])

    useEffect( async () => {
        await loadOutSideProject()
        // await loadProjectProposal()
    })

    const [proposalContainer, setProposalContainer] = useState([])

    const loadOutSideProject = async () => {
        const outsideRef = database.ref('project_proposal')
        await outsideRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                const newAry = snapshot.val()
                if(newAry) {

                    let proposalContainer = []
                    for(let i in newAry) {
                        let data = newAry[i]
                        data.id = i
                        proposalContainer.push(<Proposal proposal={data} />)
                    }
                    setProposalContainer(proposalContainer) 
                }
            }
        } )
    }

    const loadProjectProposal = async () => {
        const proposalRef = database.ref('project_proposal')
        await proposalRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                const newAry = snapshot.val()
                if(newAry) {
                } 
            }
        } )
    }

    return (
        <div className="home">
            <Header />
            <Container className="parent-container">
                <Row className="idea">
                    <Col lg="6" md="6" sm="12" className="requirement">
                        <div>
                            <img src={require('../assets/img/nifty.svg').default} className="nifty-image" />
                            <span className="io">.io</span>
                        </div>
                        <h1>NFT Projects</h1>
                        <ul>
                            <li>
                                Submit your idea for consideration
                            </li>
                            <li>
                                Get assigned a team
                            </li>
                            <li>
                                Get funded
                            </li>
                            <li>
                                Build
                            </li>
                            <li>
                                Launch
                            </li>
                        </ul>
                    </Col>
                    <Col lg="6" md="6" sm="12">
                        <img src={require('../assets/img/idea.png').default} className="idea-image" />
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <div className="sort-section">
                            <ul>
                                <li>
                                    <Form.Group>
                                        <Form.Check 
                                            type="radio"
                                            id=""
                                            label="All"
                                            name="project"
                                        />
                                    </Form.Group>
                                </li>
                                <li>
                                <Form.Group>
                                    <Form.Check 
                                        type="radio"
                                        id=""
                                        label="Nifty Projects"
                                        name="project"
                                    />
                                </Form.Group>
                                </li>
                                <li>
                                <Form.Group>
                                    <Form.Check 
                                        type="radio"
                                        id=""
                                        label="Outside Projects"
                                        name="project"
                                    />
                                </Form.Group>
                                </li>
                            </ul>
                            <Form.Group className="sort">
                                <Form.Label>Sort by:</Form.Label>
                                <Form.Select>
                                    <option>Newest</option>
                                    <option>Name</option>
                                    <option>User</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4" md="6" sm="12">
                        <div className="outside-project">
                            <Link to="/outside">
                                <div className="main-container">
                                    <i className="fa fa-plus"></i>
                                    <span>
                                        Submit Outside Project<br />
                                        (share Alpha with the Nifty fam)
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4" md="6" sm="12">
                        <div className="submit-project">
                            <Link to="/proposal">
                                <div className="main-container">
                                    <h3>Submit Project Proposal</h3>
                                    <p className="icon-section">
                                        <i className="fa fa-plus"></i>
                                    </p>
                                    <p className="question">
                                        Have a great idea? Get funded, developed, and launched right here!
                                    </p>
                                </div>
                            </Link>
                            <div className="footer-container">
                                <Row>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Art</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Roadmap</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Utility</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Community</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Team</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg="4" md="6" sm="12" className="rating-star">
                                        <div className="one-col">
                                            <p>Originality</p>
                                            <p>
                                                <StarRatingComponent 
                                                    name="rate1" 
                                                    starCount={5}
                                                    value={0}
                                                    emptyStarColor={'#e5e5e5'}
                                                />
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    {proposalContainer}
                </Row>
            </Container>
        </div>
    );
}

export default Home;