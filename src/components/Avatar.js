import { useRef, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const Avatar = (props) => {

    const imageRef = useRef(null);

    const changeImage = () => {

    }

    const handleImage = () => {

    }

    return (
        <Row className="avatar">
            <Col lg={5}>
                <h1 className="title">{ props.title }</h1>
                <p className="content">{ props.content }</p>
            </Col>
            <Col lg={3}>
                <input id="input-image" accept="image/*" type="file" name="image" className="d-none" onChange={changeImage} />
                <img ref={imageRef} src={require('../assets/img/avatar.png').default} onClick={handleImage}/>
            </Col>
            <Col lg={4}>
                <p className="description">
                    <span>submitted by:</span> <br />
                    <span>submission date:</span> <br />
                    <span>total projects submitted:</span> <br />
                    <span>total projects submitted:</span> <br />
                    <span>nodestones held:</span>
                </p>
            </Col>
            {/* <h1>{ props.title }</h1>
            <p>
                <span>{ props.content }</span>
                <input id="input-image" accept="image/*" type="file" name="image" className="d-none" onChange={changeImage} />
                <img ref={imageRef} src={require('../assets/img/avatar.png').default} onClick={handleImage}/>
            </p> */}
        </Row>
    );
}

export default Avatar;