import { Row, Col } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Panel = (props) => {
    const [art, setArt] = useState(0)
    const [roadmap, setRoadMap] = useState(0)
    const [utility, setUtility] = useState(0)
    const [community, setCommunity] = useState(0)
    const [team, setTeam] = useState(0)
    const [originality, setOriginality] = useState(0)
    
    const ratingInf = props.proposal.rating

    useEffect( () => {
        if(ratingInf) {
            let userCount = 0
            let ratingData = {}
            for(let i in ratingInf) {
                let userRatingData = ratingInf[i]
                for(let j in userRatingData)  {
                    for(let k in userRatingData[j]) {
                        if(ratingData[j] !== undefined) {
                            ratingData[j] += parseInt(userRatingData[j][k])
                        } else {
                            ratingData[j] = parseInt(userRatingData[j][k])
                        }
                    }
                
                }
                userCount ++
            }

            for(let i in ratingData) {
                switch(i) {
                    case 'art':
                        setArt(ratingData[i] / userCount)
                        break;
                    case 'community':
                        setCommunity(ratingData[i] / userCount)
                        break;
                    case 'originality':
                        setOriginality(ratingData[i] / userCount)
                        break;
                    case 'roadmap':
                        setRoadMap(ratingData[i] / userCount)
                        break;
                    case 'team':
                        setTeam(ratingData[i] / userCount)
                        break;
                    case 'utility':
                        setUtility(ratingData[i] / userCount)
                        break;
                }
            }
        }
    }, [] )
    return (
        <Col lg="4" md="6" sm="12">
            <div className="panel">
                <div className="submit-project">
                    <div className="panel-title">
                        <span className="submit">
                            <span className="title-label">Submitted by :</span> 
                            <small>{props.proposal.creator}</small>
                        </span>
                        <span className="price">
                            <span className="title-label">Price :</span>
                            <small>{props.proposal.price}</small>
                        </span>
                        <span className="supply">
                            <span className="title-label">Supply :</span>
                            <small>{props.proposal.supply}</small>
                        </span>
                    </div>
                    <Link to={`/project/${props.proposal.id}/${props.proposal.t}`}>
                        <div className="background-section" 
                            style={{
                                backgroundImage: "url(" + (props.proposal.files ? props.proposal.files[0] : '') + ")",
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
                                            value={art}
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
                                            value={roadmap}
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
                                            value={utility}
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
                                            value={community}
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
                                            value={team}
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
                                            value={originality}
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