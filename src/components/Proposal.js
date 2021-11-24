import { Row, Col } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';

const Proposal = (props) => {
    console.log(JSON.parse(props.proposal.files)[0])
    return (
        <Col lg="4" md="6" sm="12">
            <div className="submit-project">
                <p className="panel-title"><b>Submitted by:</b> doodoobacon2 <strong>Price:</strong> {props.proposal.price} <strong>Supply:</strong> {props.proposal.supply}</p>
                <Link to="/proposal">
                    <div className="main-container" style={{ 
                            backgroundColor : 'black',
                            backgroundImage: "url(" + JSON.parse(props.proposal.files)[0] + ")" , 
                            backgroundRepeat:"no-repeat", 
                            backgroundSize: "100% 100%" 
                        }}>
                        <h3>{props.proposal.projectName}</h3>
                        <p className="icon-section" style={{visibility : "hidden"}}>
                            <i className="fa fa-plus"></i>
                        </p>
                        <p className="question">
                            {props.proposal.description}
                        </p>
                    </div>
                </Link>
                <div className="footer-container">
                    <Row>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Art</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Roadmap</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Utility</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Community</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Team</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" sm="12" className="rating-star">
                            <div className="one-col">
                                <p>Originality</p>
                                <p>
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={0}
                                        emptyStarColor={'#e5e5e5'}
                                    />
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Col>
    );
}

export default Proposal;