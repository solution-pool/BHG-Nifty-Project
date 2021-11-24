import { useRef, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const Avatar = (props) => {

    const imageRef = useRef(null);

    return (
        <Row className="avatar">
            <Col lg="5" md="8" sm="8" xs="12">
                <h1 className="avatar-title">{ props.title }</h1>
                <p className="avatar-content">{ props.content }</p>
            </Col>
            <Col lg="2" md="4" sm="4" xs="12" className="avatar-container">
                <img ref={imageRef} src={require('../assets/img/avatar.png').default} />
            </Col>
            <Col lg="5" md="12" sm="12" xs="12">
                <p className="avatar-description">
                    <p>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-label">submitted by:</Col>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-profile"></Col>
                    </p>
                    <p>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-label">submission date:</Col>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-profile"></Col>
                    </p>
                    <p>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-label">total projects submitted:</Col>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-profile"></Col>
                    </p>
                    <p>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-label">nodestones held:</Col>
                        <Col lg="6" md="6" sm="6" xs="6" className="avatar-profile"></Col>
                    </p>
                </p>
            </Col>
        </Row>
    );
}

export default Avatar;