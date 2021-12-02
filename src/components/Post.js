import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { database } from '../config/firebase';
import { useState, useEffect, useRef } from 'react';
import Confirm from 'react-confirm-bootstrap';

const Post = (props) => {
    
    const [show, setShow] = useState(false)
    const [reply, setReply] = useState('')

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
                    
                    <Confirm
                        onConfirm={up}
                        body="Are you sure you want to upvote this post?"
                        confirmText="Yes"
                        title="Upvote Proposal">
                        <Button variant="success" disabled={ props.userInfo.wallet == props.data.poster ? true : false }>
                            <i className="fa fa-arrow-up"></i>
                        </Button>
                    </Confirm>
                    
                    
                    <Confirm
                        onConfirm={down}
                        body="Are you sure you want to downvote this post?"
                        confirmText="Yes"
                        title="Downvote Post">
                        <Button variant="primary" disabled={ props.userInfo.wallet == props.data.poster ? true : false }>
                            <i className="fa fa-arrow-down"></i>
                        </Button>
                    </Confirm>
                </div>
                <div className="vote-count">
                    <Button>
                        {
                            !props.data.vote ? 0 : (
                                Object.values(props.data.vote).filter( element => element == 1 ).length
                            )
                        }
                    </Button>
                    
                    <Button variant="primary">
                        {
                            !props.data.vote ? 0 : (
                                Object.values(props.data.vote).filter( element => element == -1 ).length
                            )
                        }
                    </Button>
                </div>
            </Col>
            <Col lg="10" md="10" sm="10" xs="10" className="discussion-content">
                <div className="content">
                    <p>
                        {props.data.content}
                    </p>
                </div>
                {/* { (props.data.code < 100) ?  */}
                <div className="reply">
                    <Button variant="secondary" size="sm" disabled={ props.userInfo.wallet == props.data.poster ? true : false } onClick={handleShow}>Reply</Button>
                </div>
                {/* // : '' } */}
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