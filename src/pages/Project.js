import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Container, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { database } from '../config/firebase';

const Project = (props) => {
    const [project, setProject] = useState({})
    const [artValue, setArtValue] = useState(0)
    const [roadMapValue, setRoadMapValue] = useState(0)
    const [utilityValue, setUtilityValue] = useState(0)
    const [communityValue, setCommunityValue] = useState(0)
    const [originalityValue, setOriginalityValue] = useState(0)
    const [teamValue, setTeamValue] = useState(0)
    const { id, t } = useParams()
    const [show, setShow] = useState(false)
    const [init, setInit] = useState(true)
    const [creator, setCreator] = useState({})

    useEffect( () => {
        if(init) {
            getProject()
        }
    }, [artValue, roadMapValue, utilityValue, communityValue, originalityValue, teamValue, show, project ? project.name : project, creator ? creator.name : creator] )
    
    const getProject = async () => {
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const proposalRef = database.ref(tableName + '/' + id)
        await proposalRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                const newAry = snapshot.val()
                setProject(newAry)
                const creatorRef = database.ref('member_profile/' + newAry.creatorPath)
                creatorRef.get().then((snap) => {
                    if(snap.exists) {
                        const creatorData = snap.val()
                        setCreator(creatorData)
                    }
                })

                const userID = props.userInfo.username
                const rating = newAry.rating
                if(rating && rating[userID] && init) {
                    const ratingUserData = rating[userID]
                    for(let i in ratingUserData) {
                        const ratingValue = Object.values(ratingUserData[i])[0]
                        switch (i) {
                            case 'art' :
                                setArtValue(ratingValue)
                                break;
                            case 'roadmap' :
                                setRoadMapValue(ratingValue)
                                break;
                            case 'utility' :
                                setUtilityValue(ratingValue)
                                break;
                            case 'community' :
                                setCommunityValue(ratingValue)
                                break;
                            case 'originality' :
                                setOriginalityValue(ratingValue)
                                break;
                            case 'team' :
                                setTeamValue(ratingValue)
                                break;
                        }
                    }
                    setInit(false)
                }
            }
        } )
    }

    const changeRating = async (nextValue, prevValue, name) => {
        switch(name) {
            case 'art':
                setArtValue(nextValue)
                break
            case 'community':
                setCommunityValue(nextValue)
                break
            case 'originality':
                setOriginalityValue(nextValue)
                break
            case 'team':
                setTeamValue(nextValue)
                break
            case 'roadmap':
                setRoadMapValue(nextValue)
                break
            case 'utility':
                setUtilityValue(nextValue)
                break
            default:
                break
        }
        let userID = props.userInfo.username

        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const ratingRef   = database.ref(tableName + '/' + id + '/rating/' + userID + '/' + name + '/')
        await ratingRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                let newValue = snapshot.val()
                if(newValue) {
                    const key = Object.keys(newValue)[0]
                    let updateValue = {}
                    updateValue[key] = nextValue
                    ratingRef.update(updateValue)
                } else {
                    ratingRef.push().set(nextValue)
                }
            } else {
                ratingRef.push().set(nextValue)
            }
        } )
    }

    const handleClose = () => {
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} />
            <Container className="project">
                <Row>
                    <Col lg={5} md={12} sm={12}>
                        <p className="panel-title">Project</p>
                        <div className="project-detail project-panel">
                            <h1 className="project-name">{ project ? project.name : '' }</h1>
                            <p className="project-condition">
                                <div className="supply">Supply: { project ? project.supply : '' }</div>
                                <div className="price">Price: { project ? project.price : '' }</div>
                                <div className="votes">Votes: </div>
                            </p>
                            <div className="project-thumbnail">
                                <img src={(project && project.files) ? project.files[0] : require('../assets/img/idea.png').default } />
                            </div>
                            <div className="project-upvote">
                                <Button variant={'warning'}>Upvote this project &nbsp;
                                    <i className="fa fa-chevron-up"></i>
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col lg={7} md={12} sm={12}>
                        <p className="panel-title">Author</p>
                        <div className="project-avatar project-panel">
                            <div className="photo">
                                <img src={creator.image ? creator.image : require('../assets/img/avatar.png').default} alt="Creator Avatar Image" />
                            </div>
                            <div className="detail">
                                <Row>
                                    <Col lg="6" md="6" sm="6" xs="6" className="photo-label"><p>submitted by :</p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6"><p><strong>{creator.username ? creator.username : '' }</strong></p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6" className="photo-label"><p>submission date :</p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6"><p><strong>{project.createDate ? project.createDate : '0000 / 00 / 00' }</strong></p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6" className="photo-label"><p> total projects submitted :</p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6"><p><strong>{creator.project ? creator.project : '' }</strong></p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6" className="photo-label"><p>nodestones held : </p></Col>
                                    <Col lg="6" md="6" sm="6" xs="6"><p><strong>{creator.held ? creator.held : '' }</strong></p></Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Rate this project!</p>
                        <div className="project-panel project-rate">
                            <Row>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Art</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="art" 
                                                starCount={5}
                                                value={artValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Roadmap</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="roadmap" 
                                                starCount={5}
                                                value={roadMapValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Utility</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="utility" 
                                                starCount={5}
                                                value={utilityValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Community</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="community" 
                                                starCount={5}
                                                value={communityValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Team</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="team" 
                                                starCount={5}
                                                value={teamValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6}>
                                    <div className="one-col">
                                        <p>Originality</p>
                                        <div>
                                            <StarRatingComponent 
                                                name="originality" 
                                                starCount={5}
                                                value={originalityValue}
                                                onStarClick={changeRating}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Description</p>
                        <div className="project-panel"> 
                            <p>
                            { project ? project.description : '' }
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Team Members Needed</p>
                        <div className="project-panel project-team"> 
                            <Container>
                                <p>
                                    The following team members are needed for this project. Select a role if you would like to be considered.
                                </p>
                                <Row>
                                    <Col lg="6" md="6" sm="12" className="text-center team-member-button" >
                                        <Button variant="secondary">Marketing Manager</Button>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center team-member-button">
                                        <Button variant="secondary">Discord Moderator</Button>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center team-member-button">
                                        <Button variant="secondary">Smart Contract Developer</Button>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center team-member-button">
                                        <Button variant="secondary">Web Developer</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Discussion</p>
                        <div className="project-discussion">
                            <div className="project-discussion-header row">
                                <Col lg="9" md="9" sm="6"></Col>
                                <Col lg="3" md="3" sm="6">
                                    <Button variant="primary" onClick={handleShow}>Add new post</Button>
                                </Col>
                            </div>
                        </div>
                        <div className="project-discussion-body">
                            <Container>
                                <Row>
                                    <Col lg="2" md="2" sm="2" xs="2" className="discussion-button">
                                        <div className="action">
                                            <Button variant="success">
                                                <i className="fa fa-arrow-up"></i>
                                            </Button>
                                            
                                            <Button variant="primary">
                                                <i className="fa fa-arrow-down"></i>
                                            </Button>
                                        </div>
                                        <div className="vote-count">
                                            <Button>
                                                1
                                            </Button>
                                            
                                            <Button variant="primary">
                                                0
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col lg="10" md="10" sm="10" xs="10" className="discussion-content">
                                        <p>
                                            Nullam aliquam convallis orci nec fringilla. Aliquam augue turpis, laoreet at egestas pretium, rutrum at nunc.
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="2" md="2" sm="2" xs="2" className="discussion-button">
                                        <div className="action">
                                            <Button variant="success">
                                                <i className="fa fa-arrow-up"></i>
                                            </Button>
                                            
                                            <Button variant="primary">
                                                <i className="fa fa-arrow-down"></i>
                                            </Button>
                                        </div>
                                        <div className="vote-count">
                                            <Button>
                                                1
                                            </Button>
                                            
                                            <Button variant="primary">
                                                0
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col lg="10" md="10" sm="10" xs="10" className="discussion-content">
                                        <p>
                                            Nullam aliquam convallis orci nec fringilla. Aliquam augue turpis, laoreet at egestas pretium, rutrum at nunc.
                                        </p>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
                <div className="text-center">
                    <Link to="/">&lt;&lt;-back to projects</Link>
                </div>
            </Container>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control as="textarea" rows="10" placeholder="" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Add new post
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Project;