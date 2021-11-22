import Header from '../components/Header';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';

const Project = () => {
    return (
        <div>
            <Header />
            <Container className="project">
                <Row>
                    <Col lg={5} md={12} sm={12}>
                        <p className="panel-title">Project</p>
                        <div className="project-detail project-panel">
                            <h1 className="project-name">Crypto Chimeras</h1>
                            <p className="project-condition">
                                <div className="supply">Supply: 4444</div>
                                <div className="price">Price: 0.5eth</div>
                                <div className="votes">Votes: 112</div>
                            </p>
                            <div className="project-thumbnail">
                                <img src={require('../assets/img/idea.png').default} />
                            </div>
                            <div className="project-upvote">
                                <Button variant={'warning'}>Upvote this project &nbsp;
                                    <i className="fa fa-chevron-up"></i>
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col lg={7} md={12} sm={12}>
                        <p className="panel-title">Author</p>
                        <div className="project-detail project-panel">
                            <h1>Crypto Chimeras</h1>
                            <p>Supply: 4444</p>
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
                                <Col lg={2} md={4} sm={6}>
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
                                <Col lg={2} md={4} sm={6}>
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
                                <Col lg={2} md={4} sm={6}>
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
                                <Col lg={2} md={4} sm={6}>
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
                                <Col lg={2} md={4} sm={6}>
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
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Description</p>
                        <div className="project-panel"> 
                            <p>
                                A collection of 4444 generative hybrid animals. This would be a generative PFP project. There would be an upper, middle, and lower part of the bodies. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Team Members Needed</p>
                        <div className="project-panel"> 
                            <Container>
                                <p>
                                    The following team members are needed for this project. Select a role if you would like to be considered.
                                </p>
                                <Row>
                                    <Col lg="6" md="6" sm="12" className="text-center">
                                        <p>Marketing Manager</p>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center">
                                        <p>Discord Moderator</p>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center">
                                        <p>Smart Contract Developer</p>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="text-center">
                                        <p>Web Developer</p>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <p className="panel-title">Discussion</p>
                        <div className="project-panel">
                            <Col lg="9" md="9" sm="6"></Col>
                            <Col lg="3" md="3" sm="6">
                                <Button variant="primary">Add new post</Button>
                            </Col>
                        </div>
                    </Col>
                </Row>
                <div className="text-center">
                    <Link to="/">&lt;&lt;-back to projects</Link>
                </div>
            </Container>
        </div>
    );
}

export default Project;