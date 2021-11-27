import { useRef, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const Avatar = (props) => {

    const imageRef = useRef(null);
    const today = new Date()
    return (
        <Row className="avatar">
            <Col lg="5" md="8" sm="8" xs="12">
                <h1 className="avatar-title">{ props.title }</h1>
                <p className="avatar-content">{ props.content }</p>
            </Col>
            <Col lg="2" md="4" sm="4" xs="12" className="avatar-container">
                <img ref={imageRef} src={props.userInfo.image ? props.userInfo.image : require('../assets/img/avatar.png').default} alt="User avatar" />
            </Col>
            <Col lg="5" md="12" sm="12" xs="12">
                <Row className="avatar-description">
                    <Col lg="6" md="6" sm="6" xs="6" className="avatar-label"><p>submitted by:</p></Col>
                    <Col lg="5" md="5" sm="5" xs="5" className="avatar-profile"><p>{props.userInfo.wallet}</p></Col>
                    <Col lg="6" md="6" sm="6" xs="6" className="avatar-label"><p>submission date:</p></Col>
                    <Col lg="5" md="5" sm="5" xs="5" className="avatar-profile"><p>
                        { today.getFullYear() + ' / ' + (today.getMonth() + 1) + ' / ' + today.getDate() }</p>
                    </Col>
                    <Col lg="6" md="6" sm="6" xs="6" className="avatar-label"><p>total projects submitted:</p></Col>
                    <Col lg="5" md="5" sm="5" xs="5" className="avatar-profile"><p>{props.userInfo.project ? props.userInfo.project : 0}</p></Col>
                    <Col lg="6" md="6" sm="6" xs="6" className="avatar-label"><p>nodestones held:</p></Col>
                    <Col lg="5" md="5" sm="5" xs="5" className="avatar-profile"><p>{props.userInfo.held}</p></Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Avatar;