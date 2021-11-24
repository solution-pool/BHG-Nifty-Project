import { useState, useEffect, useRef } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Header from '../components/Header';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import Panel from '../components/Panel';

const Home = () => {
    const [sort, setSort] = useState(2)
    const [projectContainer, setProposalContainer] = useState([])

    useEffect( async () => {
        await display(sort)
    })

    const changeSort = async (e) => {
        setSort(e.target.value)
        await display(e.target.value)
    }

    const display = async (sortValue) => {
        let container = []
        if(sortValue == 3) {
            await loadProposals().then( async proposals => {
                container.push(...proposals)
                await loadOutsides().then( outsides => {
                    container.push(...outsides)        
                    // container.sort( (a, b) => {

                    // } )
                    setProposalContainer(container)
                } )
            })
        } else if(sortValue == 1) {
            await loadProposals().then( res => {
                setProposalContainer(res)
            })
        } else {
            await loadOutsides().then( res => {
                setProposalContainer(res)
            })
        }

    }

    const loadProposals = async () => {
        let proposalContainer = []
        const proposalRef = database.ref('project_proposal')
        await proposalRef.get().then( (snapshot) => {
            
            if(snapshot.exists) {
                const newAry = snapshot.val()
                if(newAry) {

                    for(let i in newAry) {
                        let data = newAry[i]
                        data.id = i
            
                        proposalContainer.push(<Panel proposal={data} />)
                    }
                }
            }
        } )
        return proposalContainer
    }

    const loadOutsides = async () => {
        let outsideContainer = []
        const outsideRef = database.ref('project_outside')
        await outsideRef.get().then( (snapshot) => {

            if(snapshot.exists) {
                const newAry = snapshot.val()
                if(newAry) {

                    for(let i in newAry) {
                        let data = newAry[i]
                        data.id = i
                        outsideContainer.push(<Panel proposal={data} />)
                    }
                }
            }
        } )
        return outsideContainer;
    }

    return (
        <div className="home">
            <Header />
            <Container className="page-container">
                <Row>
                    <Col lg="6" md="6" sm="12">
                        <div className="requirement">
                            <div className="nifty-image">
                                <img src={require('../assets/img/nifty.svg').default}/>
                                <span className="io">.io</span>
                            </div>
                            <h1>NFT Projects</h1>
                            <ul id="up-ul">
                                <li>
                                    -Submit your idea for consideration
                                </li>
                                <li>
                                    -Get assigned a team
                                </li>
                                <li>
                                    -Get funded
                                </li>
                                <li>
                                    -Build
                                </li>
                                <li>
                                    -Launch
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col lg="6" md="6" sm="12">
                        <div className="idea">
                            <img src={require('../assets/img/idea.png').default} className="idea-image" />
                        </div>
                        <div>
                            <ul id="down-ul">
                                <li>
                                    -Submit your idea for consideration
                                </li>
                                <li>
                                    -Get assigned a team
                                </li>
                                <li>
                                    -Get funded
                                </li>
                                <li>
                                    -Build
                                </li>
                                <li>
                                    -Launch
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        <div className="sort-section">
                            <Row>
                            <Col lg="8" md="12" sm="12">
                                <ul>
                                    <li>
                                        <Form.Group controlId="formAll">
                                            <Form.Check 
                                                type="radio"
                                                id=""
                                                label="All"
                                                name="project"
                                                value="3"
                                                checked={sort == 3 ? true : false}
                                                onChange={changeSort}
                                            />
                                        </Form.Group>
                                    </li>
                                    <li>
                                        <Form.Group controlId="formNifty">
                                            <Form.Check 
                                                type="radio"
                                                id=""
                                                label="Nifty Projects"
                                                name="project"
                                                value="1"
                                                checked={sort == 1 ? true : false}
                                                onChange={changeSort}
                                            />
                                        </Form.Group>
                                    </li>
                                    <li>
                                    <Form.Group controlId="formOutside">
                                        <Form.Check 
                                            type="radio"
                                            id=""
                                            label="Outside Projects"
                                            name="project"
                                            value="2"
                                            checked={sort == 2 ? true : false}
                                            onChange={changeSort}
                                        />
                                    </Form.Group>
                                    </li>
                                </ul>
                            </Col>
                            <Col lg="4" md="12" sm="12">
                                <Form.Group className="sort">
                                    <Form.Label>Sort by :&nbsp; </Form.Label>
                                    <Form.Select>
                                        <option>Newest</option>
                                        <option>Name</option>
                                        <option>User</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col lg="4" md="6" sm="12">
                        <div className="panel">
                            <div className="outside-project">
                                <Link to="/outside">
                                    <div className="background-section">
                                        <div className="icon-section">
                                            <i className="fa fa-plus"></i>
                                        </div>
                                        <div className="link-section">
                                            Submit Outside Project<br />
                                            (share Alpha with the Nifty fam)
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col lg="8" md="6" sm="12"></Col>
                    <Col lg="4" md="6" sm="12">
                        <div className="panel">
                            <div className="submit-project">
                                <Link to="/proposal">
                                    <div className="background-section">
                                        <h3>Submit Project Proposal</h3>
                                        <p className="icon-section">
                                            <i className="fa fa-plus"></i>
                                        </p>
                                        <p className="question">
                                            Have a great idea? Get funded, developed, and launched right here!
                                        </p>
                                    </div>
                                </Link>
                                <div className="rating-section">
                                    <Row>
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                                        <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                        </div>
                    </Col>
                    {projectContainer}
                </Row>
            </Container>
        </div>
    );
}

export default Home;