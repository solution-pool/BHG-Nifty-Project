import { Row, Col, Button} from 'react-bootstrap';

const Post = (props) => {

    return (
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