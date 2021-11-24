import { Row, Col } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';

const Panel = (props) => {
    return (
        <Col lg="4" md="6" sm="12">
            <div className="panel">
                <div className="submit-project">
                    <Link to="/proposal">
                        <div className="background-section" 
                            style={{
                                backgroundImage: "url(" + JSON.parse(props.proposal.files)[0] + ")",
                                backgroundSize: "100%",
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "black",
                            }}
                        >
                            <h3>{props.proposal.name}</h3>
                            <p className="question">
                                {props.proposal.brief}
                            </p>
                        </div>
                    </Link>
                    <div className="rating-section">
                        <Row>
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
                            <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
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
            </div>
        </Col>
    );
}

export default Panel;