import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

const Outside = (props) => {
    const title     = "Outside Project Submission";
    const content   = "Share alpha with the nifty fam by submitting an outside project that you think has potential!";

    const handleSubmit = () => {

    }
    return (
        <div>
            <Header />
            <Container className="padding-bottom-70">
                <Avatar title={title} content={content} />
                <Row className="content">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectName">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of Project" />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formSupply">
                                    <Form.Label>Supply</Form.Label>
                                    <Form.Control type="text" placeholder="How many?" required />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectWebsite">
                                    <Form.Label>Profile Website</Form.Label>
                                    <Form.Control type="text" placeholder="Website url" required />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group className="mb-4" controlId="formProjectHighlights">
                                    <Form.Label>Project Highlights</Form.Label>
                                    <Form.Control type="text" placeholder="Why do you like this project?" required />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" placeholder="How much?" required />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectDropDate">
                                    <Form.Label>Project Drop Date</Form.Label>
                                    <Form.Control type="text" placeholder="When mint?" required/>
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectDiscord">
                                    <Form.Label>Project Discord</Form.Label>
                                    <Form.Control type="text" placeholder="Discord url" required/>
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectTwitter">
                                    <Form.Label>Project Twitter</Form.Label>
                                    <Form.Control type="text" placeholder="Twitter url" required/>
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formProjectOpensea">
                                    <Form.Label>Project OpenSea</Form.Label>
                                    <Form.Control type="text" placeholder="Opensea url" required/>
                                </Form.Group>
                            </Col>
                            <Col lg="12" md="12" sm="12" className="main-col">
                                <Form.Group controlId="formProjectDescription">
                                    <Form.Label>Project Discription</Form.Label>
                                    <Form.Control as="textarea" className="footer-element" placeholder="Detailed description of the project" />
                                </Form.Group>
                            </Col>
                            <Col lg="3" md="6" sm="12" className="main-col">
                                <Form.Group className="mb-4">
                                    <Form.Label>Art Upload</Form.Label>
                                    <div className="footer-element file-panel">
                                        <input id="input-file" type="file" name="file" className="d-none" />
                                        <Button variant="light" id="file-upload-button">Choose File</Button>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col lg="9" md="6" className="main-col"></Col>
                            <Col lg="12" className="main-col padding-bottom-20">
                                <a href="" className="back">	&lt;&lt;-back to projects</a>
                                <Button variant="secondary" type="submit" className="pull-right">
                                    <Spinner
                                    as="span"
                                    // animation={isLoading}
                                    size="sm"
                                    role="status"
                                    aria-hidden="false"
                                    />
                                    &nbsp; Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </Container>
        </div>
    );
}

export default Outside;