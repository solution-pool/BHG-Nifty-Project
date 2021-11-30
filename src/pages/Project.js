import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Container, Row, Col, Form, Button, Spinner, Modal, Overlay, Popover } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { database } from '../config/firebase';
import Post from '../components/Post';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import ReactHtmlParser from 'react-html-parser';
import { PROPOSAL_INTEREST } from '../config/constants';

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
    const [teamMember, setTeamMember] = useState({})
    const [teamContainer, setTeamContainer] = useState([])
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([])
    const [voteState, setVoteState] = useState(false)
    const [voteCount, setVoteCount] = useState(0)
    const [blocking, setBlock] = useState(false)
    const [message, setMessage] = useState('')
    const [overlayShow, setOverlayShow] = useState(false)
    const [target, setTarget] = useState(null)
    const [applicants, setApplicants] = useState('')

    useEffect( async () => {
        
        if(props.userLoad) {
            if(props.userInfo.wallet) {
                setBlock(true)
                setMessage('')
                await getProject()
            } else {
                setMessage(ReactHtmlParser("You are not registered as a Nifty member. Please sign up first. <a href='/'> Back </a>"))
                setBlock(true)
            }
        } else {
            setBlock(true)
            setMessage('')
        }
    }, [
        artValue, 
        roadMapValue, 
        utilityValue, 
        communityValue, 
        originalityValue, 
        teamValue, 
        teamMember,
        show, 
        overlayShow,
        project ? project.name : project, 
        creator ? creator.name : creator, 
        posts.length,
        props.userInfo.wallet, 
        props.userLoad
    ] )
    
    const getProject = async () => {
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const proposalRef = database.ref(tableName + '/' + id)
        await proposalRef.get().then( (snapshot) => {
            setBlock(false)
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

                const interest = JSON.parse(newAry.interest)
                const team = newAry.team
                if(interest) {
                    let container = []
                    for(let oneInterest in interest) {
                        let className = 'no-selected team-member btn btn-primary';
                        let value = 0
                        if(team && team[props.userInfo.wallet]) {
                            const teamData = team[props.userInfo.wallet]
                            if(teamData[oneInterest]) {
                                className = 'selected team-member'
                                value = 1
                            } else {
                                className = 'no-selected team-member'
                                value = 0
                            }
                        }
                        let applicantCount = 0
                        let applicantMember = []
                        for(let j in team) {
                            const oneApplyData = team[j]
                            if(oneApplyData[oneInterest] == 1) {
                                applicantCount ++
                                applicantMember.push(j)
                            }
                        }
                        let one_container = <Col lg="6" md="12" sm="12" className="text-center team-member-button" >
                                                <Button className={className} name={oneInterest} id={oneInterest} value={value} onClick={changeTeamMember}>
                                                    {PROPOSAL_INTEREST[oneInterest]}
                                                    <Button className="applicants">
                                                        <div className="applicants-count" data-applicants={JSON.stringify(applicantMember)} onClick={showApplicants}>{applicantCount}</div>
                                                        <div className="applicants-applicants" data-applicants={JSON.stringify(applicantMember)} onClick={showApplicants}>applicants</div>
                                                    </Button>
                                                </Button>
                                            </Col>
                        container.push(one_container)
                    }

                    setTeamContainer(container)
                }

                const rating = newAry.rating
                if(rating && rating[props.userInfo.wallet]) {
                    const ratingUserData = rating[props.userInfo.wallet]
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
                }

                const postData = newAry.post
                if(postData) {
                    let postHtml = []
                    let postAry = []
                    for(let i in postData) {
                        let onePost = postData[i]
                        onePost.postID = i
                        onePost.id = id
                        onePost.t = t
                        postAry.push(onePost)
                    }

                    postAry.sort( (a, b) => {
                        let aVote = !a.vote ? 0 : Object.values(a.vote).length;
                        let bVote = !b.vote ? 0 : Object.values(b.vote).length;

                        return bVote - aVote;
                    } )

                    postHtml = postAry.map( element => <Post data={element} userInfo={props.userInfo} />)
                    setPosts(postHtml)
                }

                const voteData = newAry.vote
                if(voteData && init) {
                    for(let i in voteData) {
                        if(voteData[i] == props.userInfo.wallet) {
                            setVoteState(true)
                            break
                        }
                    }
                    setVoteCount(Object.values(voteData).length)
                }
                
                // setInit(true)
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
        let userID = props.userInfo.wallet

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

    const showApplicants = (e) => {
        e.stopPropagation()
        const applicantsData = e.target.getAttribute('data-applicants')
        const applicantsAry  = JSON.parse(applicantsData)
        setOverlayShow(!overlayShow)
        setTarget(e.target)

        database.ref('member_profile').get().then( (snapshot) => {
            if(snapshot.exists) {
                const allUserData = Object.values(snapshot.val())
                let applicantsHtml =  ''
                for(let i of applicantsAry) {
                    const selUser = allUserData.find(element => element.wallet == i)

                    if(!selUser) {
                        continue
                    }
                    applicantsHtml += selUser.username + '<br />'
                }
                setApplicants(ReactHtmlParser(applicantsHtml))
            }
        } )
    }

    const changeTeamMember = (e) => {
        const name = e.target.name
        const value = e.target.value
        let team = JSON.parse(JSON.stringify(teamMember))

        console.log(e.target)
        team[name] = (1 - value)
        e.target.value = 1 - value
        if(value == 0) {
            e.target.className = 'selected team-member btn btn-primary'
        } else {
            e.target.className = 'no-selected team-member  btn btn-primary'
        }
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const teamRef = database.ref(tableName + '/' + id + '/team/' + props.userInfo.wallet + '/')

        teamRef.update(team)

        setTeamMember(team)
    }

    const changePost = (e) => {
        setPost(e.target.value)
    }

    const handleSave = () => {
        const wallet = props.userInfo.wallet
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const postRef = database.ref(tableName + '/' + id + '/post/')
        const newPostRef = postRef.push()
        newPostRef.set({
            up : 0,
            down : 0,
            content : post,
            poster : wallet,
        })
        setPost('')
        setShow(false);
    }

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true);

    const vote = () => {
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const voteRef = database.ref(tableName + '/' + id + '/vote/')
        voteRef.push().set(props.userInfo.wallet)
        setVoteState(true)
        voteRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                const voteValues = snapshot.val()
                setVoteCount(Object.values(voteValues).length)
            }
        } )
    }
    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} userInfo={props.userInfo} />
            <BlockUi tag="div" blocking={blocking} message={message} keepInView>
                <Container className="project">
                    <Row>
                        <Col lg={5} md={12} sm={12}>
                            <p className="panel-title">Project</p>
                            <div className="project-detail project-panel">
                                <h1 className="project-name">{ project ? project.name : '' }</h1>
                                <p className="project-condition">
                                    <div className="supply">Supply: { project ? project.supply : '' }</div>
                                    <div className="price">Price: { project ? project.price : '' }</div>
                                    <div className="votes">Votes: {voteCount}</div>
                                </p>
                                <div className="project-thumbnail">
                                    {
                                        (project && project.files) ? 
                                        (<img src={project.files[0]} />) :
                                        (<div className="default-image"></div>)
                                    }
                                </div>
                                <div className="project-upvote">
                                    <Button variant={'warning'} disabled={voteState} onClick={vote}>Upvote this project &nbsp;
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
                            <div className="project-panel project-description"> 
                                <p>
                                { project ? project.description : '' }
                                </p>
                            </div>
                        </Col>
                    </Row>
                    {(t == 1) ? (
                    <Row>
                        <Col lg="12" md="12" sm="12">
                            <p className="panel-title">Team Members Needed</p>
                            <div className="project-panel project-team"> 
                                <Container>
                                    <p>
                                        The following team members are needed for this project. Select a role if you would like to be considered.
                                    </p>
                                    <Row>
                                        {teamContainer}
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>) : ''}
                    <Row>
                        <Col lg="12" md="12" sm="12">
                            <p className="panel-title">Discussion</p>
                            <div className="project-discussion">
                                <div className="project-discussion-header row">
                                    <Col lg="9" md="8" sm="6"></Col>
                                    <Col lg="3" md="4" sm="6">
                                        <Button variant="primary" onClick={handleShow}>Add new post</Button>
                                    </Col>
                                </div>
                            </div>
                            <div className="project-discussion-body">
                                <Container>
                                    {posts}
                                </Container>
                            </div>
                        </Col>
                    </Row>
                    <div className="text-center back">
                        <Link to="/">&lt;&lt;-back to projects</Link>
                    </div>
                </Container>
            </BlockUi>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control as="textarea" rows="10" placeholder="" value={post} onChange={changePost} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSave}>
                        Add new post
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Overlay
                show={overlayShow}
                target={target}
                placement="top"
                // container={ref}
                containerPadding={20}
            >
                <Popover id="popover-contained">
                <Popover.Body>
                    {applicants}
                </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

export default Project;