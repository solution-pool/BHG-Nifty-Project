import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { database } from '../config/firebase';
import { useState, useEffect, useRef } from 'react';

const Post = (props) => {

    const [upCount, setUpCount] = useState(0)
    const [downCount, setDownCount] = useState(0)
    const [votes, setVotes] = useState([]) 
    const [show, setShow] = useState(false)
    const [reply, setReply] = useState('')

    useEffect( () => {
        if((props.data.vote || votes.length)) {
            let voteValues
            if(votes.length) {
                voteValues = votes
            } else {
                voteValues = Object.values(props.data.vote)
            }
            let upValue = 0 
            let downValue = 0
            for(let i = 0; i < voteValues.length; i ++ ) {
               if(voteValues[i] == 1) {
                    upValue ++
                } else {
                    downValue ++
                }
                setUpCount(upValue)
                setDownCount(downValue)
            }
        }
    })

    const up = async () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.wallet + '/')
        votePostRef.set(1)
        props.onChange(!props.trigger)
    }

    const down = async () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.wallet + '/')
        votePostRef.set(-1)
        props.onChange(!props.trigger)
    }

    const sendReply = async (e) => {
        e.preventDefault()
        const code = props.data.code
        const wallet = props.userInfo.wallet
        let tableName = (props.t == 1) ? 'project_proposal' : 'project_outside'
        const postRef = database.ref(tableName + '/' + props.id + '/post/')
        await postRef.get().then( async (snapshot) => {
            let newCode
            const allPosts = snapshot.val()
            const allPostArry = Object.values(allPosts)
            const filtered = allPostArry.filter( (a) => {
                return a.code > code * 100 && a.code < (code + 1) * 100
            } )
            if(filtered.length) {
                filtered.sort( (a, b) => {
                    return a.code - b.code
                } )
                const lastPost = filtered[filtered.length - 1]
                newCode = parseInt(lastPost.code) +  1
            } else {
                newCode = parseInt(code * 100 + 1)
            }
            const newPostRef = postRef.push()
            await newPostRef.set({
                up : 0,
                down : 0,
                content : reply,
                poster : wallet,
                code : newCode
            })
            setShow(false)
            setReply('')
            props.onChange(!props.trigger)
        } )
    }

    const changeReply = (e) => {
        setReply(e.target.value)
    }

    const handleClose = () => setShow(false)

    const handleShow = () => setShow(true);

    return (
        <Row>
            <Col lg="2" md="2" sm="2" xs="2" className="discussion-button">
                <div className="action">
                    <Button variant="success" onClick={up}>
                        <i className="fa fa-arrow-up"></i>
                    </Button>
                    
                    <Button variant="primary" onClick={down}>
                        <i className="fa fa-arrow-down"></i>
                    </Button>
                </div>
                <div className="vote-count">
                    <Button>
                        {upCount}
                    </Button>
                    
                    <Button variant="primary">
                        {downCount}
                    </Button>
                </div>
            </Col>
            <Col lg="10" md="10" sm="10" xs="10" className="discussion-content">
                <div className="content">
                    <p>
                        {props.data.content}
                    </p>
                </div>
                { (props.data.code < 100) ? 
                <div className="reply">
                    <Button variant="secondary" size="sm" onClick={handleShow}>Reply</Button>
                </div>
                : '' }
            </Col>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Form onSubmit={sendReply}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control as="textarea" rows="10" placeholder="" value={reply} onChange={changeReply} required/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Reply
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Row>
    );
}

export default Post;