import { useState, useEffect, useRef } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Header from '../components/Header';
import StarRatingComponent from 'react-star-rating-component';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import Panel from '../components/Panel';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Home = (props) => {
    const [sort, setSort] = useState(6)
    const [type, setType] = useState(1)
    const [projectContainer, setProposalContainer] = useState([])
    const [blocking, setBlock] = useState(false)
    const [init, setInit] = useState(true)
    const { t } = useParams()
    const [messageHandler, setMessageHandler] = useState(true)
    const navigate = useNavigate()

    const ratingString = [
        'Art', 'Roadmap', 'Utility', 'Community', 'Team', 'Originality'
    ]

    useEffect( async () => {
        setInit(false)
        if(props.userLoad == true) {
            if(props.userInfo.wallet || props.reload == true ) {
                setBlock(false)
                await display()
            } else {
                setBlock(true)
                if(messageHandler) {
                    NotificationManager.error('You are not registered as a Nifty member. Please sign up first.', 'Error', 5000)
                    setMessageHandler(false)
                }
            }
        } else if(props.userLoad == -1) {
            setBlock(true)
            if(messageHandler) {
                NotificationManager.error('You are not registered as a Nifty member. Please sign up first.', 'Error', 5000)
                setMessageHandler(false)
            }
        } else if(props.userLoad == -2) {
            setBlock(true)
            if(messageHandler) {
                NotificationManager.error('Network connection Failed!', 'Error', 5000)
                setMessageHandler(false)
            }
 
        } else {
            setBlock(true)
        }
        

        if(t && init) {
            if(t == 1) {
                window.scrollTo(0, 0)
                NotificationManager.success('The project proposal was successfully submitted.', 'Success', 1000)
            } else if(t == 2)  {
                window.scrollTo(0, 0)
                NotificationManager.success('The outside project was successfully submitted.', 'Success', 1000)
            }
            setInit(false)
            navigate('/')
        }
    }, [projectContainer.length, props.userInfo.wallet, props.userLoad, sort, type, init, messageHandler])

    const changeSort = (e) => {
        setSort(e.target.value)
    }

    const changeType = (e) => {
        setType(e.target.value)
    } 

    const display = async () => {
        let container = []
        if(type == 3) {
            await loadProposals().then( async proposals => {
                container.push(...proposals)
                await loadOutsides().then( outsides => {
                    container.push(...outsides)
                    showPanel(container)
                } )
            })
        } else if(type == 1) {
            await loadProposals().then( res => {
                showPanel(res)
            })
        } else {
            await loadOutsides().then( res => {
                showPanel(res)                
            })
        }
    }

    const showPanel = (container) => {
        if(sort == 6) {
            container.sort( (a, b) => {
                if(b.createDate > a.createDate) {
                    return 1
                } else if(a.createDate > b.createDate) {
                    return -1
                } else {
                    let aVote = !a.vote ? 0 : Object.values(a.vote).length;
                    let bVote = !b.vote ? 0 : Object.values(b.vote).length;

                    if(bVote > aVote) {
                        return 1
                    } else if(aVote > bVote) {
                        return -1 
                    } else {
                        return 0
                    }
                }
            })
        } else if(sort == 7) {
            container.sort( (a, b) => {
                let aVote = !a.vote ? 0 : Object.values(a.vote).length;
                let bVote = !b.vote ? 0 : Object.values(b.vote).length;

                if(bVote > aVote) {
                    return 1
                }  else if(aVote > bVote) {
                    return -1
                } else {
                    if(b.createDate > a.createDate) {
                        return 1
                    } else if(a.createDate > b.createDate) {
                        return -1
                    } else {
                        return 0
                    }
                }
            } )
        } else {
            const sortByString = ratingString[sort]
            container.sort( (a, b) => {
                let aSort, bSort;
                if(!a.rating) {
                    aSort = 0
                } else {
                    const ratingAry = Object.values(a.rating)
                    let userCount = 0
                    let ratingSum = 0
                    for(let oneUserRating of ratingAry) {
                        if(oneUserRating[sortByString.toLowerCase()]) {
                            for(let i in oneUserRating[sortByString.toLowerCase()]) {
                                ratingSum += parseInt(oneUserRating[sortByString.toLowerCase()][i])
                            }
                        }
                        userCount ++
                    }
                    aSort = ratingSum / userCount
                }

                if(!b.rating) {
                    bSort = 0 
                } else {
                    const ratingAry = Object.values(b.rating)
                    let userCount = 0
                    let ratingSum = 0
                    for(let oneUserRating of ratingAry) {
                        if(oneUserRating[sortByString.toLowerCase()]) {
                            for(let i in oneUserRating[sortByString.toLowerCase()]) {
                                ratingSum += parseInt(oneUserRating[sortByString.toLowerCase()][i])
                            }
                        }
                        userCount ++
                    }
                    bSort = ratingSum / userCount
                }

                if(bSort > aSort) {
                    return 1
                } else if(bSort < aSort) {
                    return -1 
                } else {
                    return 0
                }
            } )
        }
        const panels = container.map( (element) => <Panel key={element.id} proposal={element} userInfo={props.userInfo} userLoad={props.userLoad} />)
        setProposalContainer(panels)
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
                        data.t = 1
            
                        proposalContainer.push(data)
                        // proposalContainer.push(<Panel proposal={data} userInfo={props.userInfo} userLoad={props.userLoad}/>)
                    }
                }
            }
        } ).catch(e => {                
            if(messageHandler) {
                NotificationManager.error('Network connection failed. Please check if you are connected to the network correctly.', 'Error', 5000)
                setMessageHandler(false)
            }
        })
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
                        data.t = 2

                        outsideContainer.push(data)
                        // outsideContainer.push(<Panel proposal={data} userInfo={props.userInfo} userLoad={props.userLoad} />)
                    }
                }
            }
        } ).catch( e => {
            if(messageHandler) {
                NotificationManager.error('Network connection failed. Please check if you are connected to the network correctly.', 'Error', 5000)
                setMessageHandler(false)
            }
        } )
        return outsideContainer;
    }

    return (
        <div className="home">
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} noHeaderBack={true} userInfo={props.userInfo} />
            <Container className="page-container">
                <NotificationContainer />
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
                            <img src={require('../assets/img/idea.svg').default} className="idea-image" />
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
                                                checked={type == 3 ? true : false}
                                                onChange={changeType}
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
                                                checked={type == 1 ? true : false}
                                                onChange={changeType}
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
                                            checked={type == 2 ? true : false}
                                            onChange={changeType}
                                        />
                                    </Form.Group>
                                    </li>
                                </ul>
                            </Col>
                            <Col lg="4" md="12" sm="12">
                                <Form.Group className="sort">
                                    <Form.Label>Sort by :&nbsp; </Form.Label>
                                    <Form.Select onChange={changeSort} value={sort}>
                                        <option value="6">Newest</option>
                                        <option value="7">Most Upvotes</option>
                                        <option value="0">Art</option>
                                        <option value="1">Roadmap</option>
                                        <option value="2">Utility</option>
                                        <option value="3">Community</option>
                                        <option value="4">Team</option>
                                        <option value="5">Originality</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col lg="4" md="6" sm="12">
                        <div className="panel">
                            <BlockUi tag="div" blocking={blocking} message="">
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
                            </BlockUi>
                        </div>
                    </Col>
                    <Col lg="8" md="6" sm="12"></Col>
                    <Col lg="4" md="6" sm="12">
                        <div className="panel">
                            <BlockUi tag="div" blocking={blocking} message="">
                                <div className="submit-project">
                                    <Link to="/proposal">
                                        <div className="background-section">
                                            <div className="new-gradient">
                                                <h3>Submit Project Proposal</h3>
                                                <p className="icon-section">
                                                    <i className="fa fa-plus"></i>
                                                </p>
                                                <p className="question">
                                                    Have a great idea? Get funded, developed, and launched right here!
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="rating-section">
                                        <Row>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Art</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Roadmap</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Utility</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Community</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Team</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                                <div className="one-col">
                                                    <p>Originality</p>
                                                    <div className="star-section">
                                                        <StarRatingComponent 
                                                            name="rate1" 
                                                            starCount={5}
                                                            value={0}
                                                            emptyStarColor={'#e5e5e5'}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </BlockUi>
                        </div>
                    </Col>
                    {projectContainer}
                </Row>
            </Container>
        </div>
    );
}

export default Home;