import { Row, Col, Button} from 'react-bootstrap';
import { database } from '../config/firebase';
import { useState, useEffect, useRef } from 'react';

const Post = (props) => {

    const [upCount, setUpCount] = useState(0)
    const [downCount, setDownCount] = useState(0)
    useEffect( () => {
        if(props.data.vote) {
            let votes = Object.values(props.data.vote)
            let upValue = 0 
            let downValue = 0
            for(let i = 0; i < votes.length; i ++ ) {
               if(votes[i] == 1) {
                    upValue ++
                } else {
                    downValue ++
                }
                setUpCount(upValue)
                setDownCount(downValue)
            }
        }
    })

    const up = () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.username + '/')
        votePostRef.set(1)
    }

    const down = () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const votePostRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/vote/' + props.userInfo.username + '/')
        votePostRef.set(-1)
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