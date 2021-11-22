import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

const Proposal = () => {
    const title = "Project Proposal";
    const content = "Share alpha with the nifty fam by submitting an outside project that you think has potential!";

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
                                    <Form.Control type="text" placeholder="What do yo call your project?" />
                                </Form.Group>
                                <Form.Group controlId="formBriefProjectSummary" className="control-bundle">
                                    <Form.Label>Brief Project Summary</Form.Label>
                                    <Form.Control type="text" placeholder="Sum up the project in a sentence or two" />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group controlId="formSupply">
                                    <Form.Label>Supply</Form.Label>
                                    <Form.Control type="text" placeholder="How many items in your project?" required />
                                </Form.Group>
                                <Form.Group controlId="formPrice" className="control-bundle">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" placeholder="Your proposed selling price." required />
                                </Form.Group>
                            </Col>
                            <Col lg="4" md="6" sm="12" className="main-col">
                                <Form.Group className="mb-4">
                                    <Form.Label>Files<small>(please provide art examples or any relevant files)</small></Form.Label>
                                    <div className="footer-element file-panel">
                                        <input id="input-file" type="file" name="file" className="d-none" />
                                        <Button variant="light" id="file-upload-button">Add File</Button>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col lg="12" md="12" sm="12" className="main-col">
                                <Form.Group controlId="formProjectDescription">
                                    <Form.Label>Detailed Project Discription</Form.Label>
                                    <Form.Control as="textarea" className="footer-element" placeholder="Describe all aspects of your proposed project in detail." />
                                </Form.Group>
                            </Col>
                            <Col lg="12" md="12" sm="12" className="main-col interest-panel">
                                <Form.Group className="mb-4">
                                    <Form.Label>Expertise/ Interest<small>(check all that apply)</small></Form.Label>
                                    <Row className="interest-body">
                                        <Col lg={4} md={6} sm={12}>
                                            have/read
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            have/read
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            have/read
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataA">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_A_A" value="A_A" />
                                                <Form.Check type="checkbox" label="Artist" className="interest" id="checkbox_interest_A_B" value="A_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataB">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_B_A" value="B_A" />
                                                <Form.Check type="checkbox" label="Game Developer" className="interest" id="checkbox_interest_B_B" value="B_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataC">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_C_A" value="C_A" />
                                                <Form.Check type="checkbox" label="Community Manager" className="interest" id="checkbox_interest_C_B" value="C_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataD">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_H" value="D_A" />
                                                <Form.Check type="checkbox" label="Project Manager" className="interest" id="checkbox_interest_D_B" value="D_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataE">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_E_A" value="E_A" />
                                                <Form.Check type="checkbox" label="Musician" className="interest" id="checkbox_interest_E_B" value="E_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataF">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_F_A" value="F_A" />
                                                <Form.Check type="checkbox" label="Photographer" className="interest" id="checkbox_interest_F_B" value="F_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataG">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_G_A" value="G_A" />
                                                <Form.Check type="checkbox" label="Marketing Plan/ Manager" className="interest" id="checkbox_interest_G_B" value="G_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataH">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_H_A" value="H_A" />
                                                <Form.Check type="checkbox" label="Business Developer" className="interest" id="checkbox_interest_H_B" value="H_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataI">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_I_A" value="I_A" />
                                                <Form.Check type="checkbox" label="Social Media Manager" className="interest" id="checkbox_interest_I_B" value="I_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataJ">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_J_A" value="J_A" />
                                                <Form.Check type="checkbox" label="Smart Contract Developer" className="interest" id="checkbox_interest_J_B" value="J_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataK">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_K_A" value="K_A" />
                                                <Form.Check type="checkbox" label="Data Analyst" className="interest" id="checkbox_interest_K_B" value="K_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataL">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_L_A" value="L_A" />
                                                <Form.Check type="checkbox" label="Discord Moderator" className="interest" id="checkbox_interest_L_B" value="L_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataM">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_M_A" value="M_A" />
                                                <Form.Check type="checkbox" label="Web Developer" className="interest" id="checkbox_interest_M_B" value="M_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataN">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_N_A" value="N_A" />
                                                <Form.Check type="checkbox" label="AI Developer" className="interest" id="checkbox_interest_N_B" value="N_B" />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formInterestDataO">
                                                <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_O_A" value="O_A" />
                                                <Form.Check type="checkbox" label="Other" className="interest" id="checkbox_interest_O_B" value="O_B" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
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

export default Proposal;