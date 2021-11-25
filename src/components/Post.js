import { Row, Col, Button} from 'react-bootstrap';
import { database } from '../config/firebase';

const Post = (props) => {

    const up = () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const postRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/' + props.userInfo.username + '/')
        postRef.set(1)
    }

    const down = () => {
        let tableName = (props.data.t == 1) ? 'project_proposal' : 'project_outside'
        const postRef = database.ref(tableName + '/' + props.data.id + '/post/' + props.data.postID + '/' + props.userInfo.username + '/')
        postRef.set(-1)
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
                        {props.data.up}
                    </Button>
                    
                    <Button variant="primary">
                        {props.data.down}
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