import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Container, Row, Col, Form, Button, Modal, Overlay, Popover } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { database } from '../config/firebase';
import Post from '../components/Post';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import ReactHtmlParser from 'react-html-parser';
import { PROPOSAL_INTEREST } from '../config/constants';
import Confirm from 'react-confirm-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const prices = [
    '', 'ETH', 'Ada', 'BNB', 'MATIC', 'SOL', 'IMX'
]
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
    const [trigger, setTrigger] = useState(false)
    const [messageHandler, setMessageHandler] = useState(true)
    const [init, setInit] =  useState(true)

    useEffect( async () => {
        if(init) {
            window.scrollTo(0, 0)
            setInit(false)
        }
        
        if(props.userLoad == true) {
            if(props.userInfo.wallet) {
                setBlock(false)
                await getProject();
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
        trigger,
        props.userInfo.wallet, 
        props.userLoad
    ] )
    
    const getProject = async () => {
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const proposalRef = database.ref(tableName + '/' + id)
        await proposalRef.get().then( async (snapshot) => {
            if(snapshot.exists) {
                const newAry = snapshot.val()
                setProject(newAry)
                const creatorRef = database.ref('member_profile/' + newAry.creatorPath)
                creatorRef.get().then((snap) => {
                    if(snap.exists) {
                        const creatorData = snap.val()
                        if(creatorData.wallet == props.userInfo.wallet) {
                            setVoteState(true);
                        }
                        setCreator(creatorData)
                    }
                })

                let interest = null;
                if(newAry.interest) {
                    interest = JSON.parse(newAry.interest)
                }
                const team = newAry.team
                if(interest) {
                    let container = []
                    await database.ref('member_profile').get().then( (snapshot) => {
                        if(snapshot.exists()) {
                            const users = Object.values(snapshot.val())
                            for(let oneInterest in interest) {
                                if(interest[oneInterest] == 'A') {
                                    continue; // role was selected as 'have'
                                }
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
                                        const username = users.find( (e) => e.wallet == j ).username
                                        applicantMember.push(username)
                                    }
                                }
                                let one_container = <Col lg="6" md="12" sm="12" key={oneInterest} className="text-center team-member-button" >
                                                        <Button className={className} name={oneInterest} id={oneInterest} value={value} onClick={changeTeamMember}>
                                                            {PROPOSAL_INTEREST[oneInterest]}
                                                            <Button className="applicants" data-applicants={JSON.stringify(applicantMember)} onBlur={hideOver} onClick={showApplicants}>
                                                                <div className="applicants-count" data-applicants={JSON.stringify(applicantMember)} onBlur={hideOver} onClick={showApplicants}>{applicantCount}</div>
                                                                <div className="applicants-applicants" data-applicants={JSON.stringify(applicantMember)} onBlur={hideOver} onClick={showApplicants}>applicants</div>
                                                            </Button>
                                                        </Button>
                                                    </Col>
                                container.push(one_container)
                            }
                        }
                    } )
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
                    let postAry = []
                    for(let i in postData) {
                        let onePost = postData[i]
                        onePost.postID = i
                        onePost.id = id
                        onePost.t = t
                        postAry.push(onePost)
                    }

                    postAry.sort( (a, b) => {
                        return b.code -  a.code
                    } )

                    for(let i = 0; i < postAry.length; i ++) {
                        if(postAry[i].code < 100) {
                            break;
                        } else {
                            const parentCode = (postAry[i].code - postAry[i].code % 100) / 100
                            const parent = postAry.find( element => element.code == parentCode )
                            if(parent.child) {
                                parent.child.push(postAry[i])
                                parent.child.sort( (a, b) => {
                                    let aVote = !a.vote ? 0 : Object.values(a.vote).length;
                                    let bVote = !b.vote ? 0 : Object.values(b.vote).length;

                                    return bVote - aVote;
                                } )
                            } else {
                                parent.child = [postAry[i]]
                            }
                        }
                    }

                    drawPost(postAry)
                }

                const voteData = newAry.vote
                if(voteData) {
                    for(let i in voteData) {
                        if(voteData[i] == props.userInfo.wallet) {
                            setVoteState(true)
                            break
                        }
                    }
                    setVoteCount(Object.values(voteData).length)
                }
            }
            setBlock(false)
        } )
    }

    const drawPost = (postAry) => {
        const draw = (postOne) => {
            postHTML.push(
                <div key={postOne.postID} style={{ paddingLeft: 3 * (Math.floor(Math.log10(postOne.code))) + "vw" }}>
                    <Post data={postOne} userInfo={props.userInfo} t={t} id={id} onChange={changeTrigger} trigger={trigger} />
                </div>
            );
            if(postOne.child) {
                for(let i = 0; i < postOne.child.length; i ++ ) {
                    draw(postOne.child[i])
                }
            } else {
                return
            }
        }

        let postHTML = []
        postAry.sort( (a, b) => {
            let aVote = !a.vote ? 0 : Object.values(a.vote).length;
            let bVote = !b.vote ? 0 : Object.values(b.vote).length;

            return bVote - aVote;
        } )

        for(let i = 0 ; i < postAry.length ; i ++ ) {
            if(postAry[i].code > 100) {
                continue
            } else {
                draw(postAry[i])
            }
        }

        setPosts(postHTML)
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

    const showApplicants = async (e) => {
        e.stopPropagation()
        const applicantsData = e.target.getAttribute('data-applicants')
        const applicantsAry  = JSON.parse(applicantsData)
        if(applicantsAry.length) {
            let applicantsHtml =  ''
            for(let i in applicantsAry) {
                if( i == applicantsAry.length - 1) {
                    applicantsHtml += applicantsAry[i];
                } else {
                    applicantsHtml += applicantsAry[i] + '<br />';
                }
            }
            setApplicants(ReactHtmlParser(applicantsHtml))
            if(overlayShow == true) {
                setOverlayShow(false)
                setTarget(e.target)
            } else {
                setOverlayShow(true)
                setTarget(e.target)
            }
        }
    }

    const hideOver = () => {
        setOverlayShow(false)
    }

    const changeTeamMember = (e) => {
        const name = e.target.name
        const value = e.target.value
        let team = JSON.parse(JSON.stringify(teamMember))
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

    const changeTrigger = (e) => {
        setTrigger(e);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const wallet = props.userInfo.wallet
        let tableName = (t == 1) ? 'project_proposal' : 'project_outside'
        const postRef = database.ref(tableName + '/' + id + '/post/')
        await postRef.get().then( async (snapshot) => {
            let newCode
            if(snapshot.exists()) {
                const allPosts = snapshot.val()
                const allPostArry = Object.values(allPosts)
                const filtered = allPostArry.filter( e => {
                    return e.code < 100
                } )
                filtered.sort( (a, b) => {
                    return a.code - b.code
                } )

                const lastPost = filtered[filtered.length - 1]
                newCode = parseInt(lastPost.code) + 1
            } else {
                newCode = 1
            }
            const newPostRef = postRef.push()
            await newPostRef.set({
                up : 0,
                down : 0,
                content : post,
                poster : wallet,
                code : newCode
            })
            setPost('')
            setShow(false);
        } )
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
                    <NotificationContainer />
                    <Row>
                        <Col lg={5} md={12} sm={12}>
                            <p className="panel-title">Project
                            { (t == 1 && creator && props.userInfo && creator.wallet == props.userInfo.wallet) ? 
                                <Link to={"/proposal/" + id} className="btn btn-secondary btn-sm edit-proposal">Edit your proposal</Link>
                             : '' }
                             { (t == 2 && creator && props.userInfo && creator.wallet == props.userInfo.wallet) ? 
                                 <Link to={"/outside/" + id} className="btn btn-secondary btn-sm edit-proposal">Edit this project</Link>
                              : '' }
                            </p>
                            <div className="project-detail project-panel">
                                <h1 className="project-name" title={project ? project.name : ''}>{ project ? project.name : '' }</h1>
                                <div className="project-condition">
                                    <div className="supply">Supply: { project ? project.supply : '' }</div>
                                    <div className="price">Price: { project ? (project.price + ' ' + (prices[project.blockchain] ? prices[project.blockchain] : '')) : '' }</div>
                                    <div className="votes">Votes: {voteCount}</div>
                                </div>
                                <div className="project-thumbnail">
                                    {
                                        (project && project.files) ? 
                                        (<img src={Object.values(project.files).shift()} />) :
                                        (<div className="default-image"></div>)
                                    }
                                </div>
                                <div className="project-upvote">
                                    <Confirm
                                        onConfirm={vote}
                                        body="Are you sure you want to upvote this proposal?"
                                        confirmText="Yes"
                                        title="Upvote Proposal">
                                        <Button variant={'warning'} disabled={voteState} onClick={vote}>Upvote this project &nbsp;
                                            <i className="fa fa-chevron-up"></i>
                                        </Button>
                                    </Confirm>
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
                                            <div className="star-section">
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
                                            <div className="star-section">
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
                                            <div className="star-section">
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
                                            <div className="star-section">
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
                                            <div className="star-section">
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
                                            <div className="star-section">
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
                <Form onSubmit={handleSave}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control as="textarea" rows="10" placeholder="" value={post} onChange={changePost} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Add new post
                        </Button>
                    </Modal.Footer>
                </Form>
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