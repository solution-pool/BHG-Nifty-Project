import { Row, Col, Button} from 'react-bootstrap';
import { database } from '../config/firebase';
import { useState, useEffect, useRef } from 'react';

const Post = (props) => {

    const [upCount, setUpCount] = useState(0)
    const [downCount, setDownCount] = useState(0)
    const [votes, setVotes] = useState([]) 
    useEffect( () => {
        if(props.data.vote || votes.length) {
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
    }, [votes])

    const up = async () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.wallet + '/')
        votePostRef.set(1)
        await resetPostData()
    }

    const down = async () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.wallet + '/')
        votePostRef.set(-1)
        await resetPostData()
    }

    const resetPostData = () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote')
        votePostRef.get().then( (snapshot) => {
            if(snapshot.exists) {
                const voteValues = snapshot.val()
                setVotes(Object.values(voteValues))
            }
        } )
    }

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
                <p>
                    {props.data.content}
                </p>
            </Col>
        </Row>
    );
}

export default Post;