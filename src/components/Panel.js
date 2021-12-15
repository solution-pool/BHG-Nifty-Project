import { Row, Col } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const prices = [
    '', 'ETH', 'Ada', 'BNB', 'MATIC', 'SOL', 'IMX'
]
const Panel = (props) => {
    const [art, setArt] = useState(0)
    const [roadmap, setRoadMap] = useState(0)
    const [utility, setUtility] = useState(0)
    const [community, setCommunity] = useState(0)
    const [team, setTeam] = useState(0)
    const [originality, setOriginality] = useState(0)
    const [blocking, setBlock] = useState(false)
    const [resetFlag, setReset] = useState(false)
    
    const ratingInf = props.proposal.rating

    useEffect( () => {
        if(props.userLoad) {
            if(props.userInfo.wallet) {
                setBlock(false)
            } else {
                setBlock(true)
            }
        } else {
            setBlock(true)
        }
        changeReset()
        if(resetFlag == true) {
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
        }   
    }, [props.proposal, props.userInfo.wallet, props.userLoad, resetFlag] )

    const changeReset = () => {
        setArt(0)
        setRoadMap(0)
        setUtility(0)
        setCommunity(0)
        setTeam(0)
        setOriginality(0)
        setReset(true)
    }
    return (
        <Col lg="4" md="6" sm="12">
            <BlockUi tag="div" blocking={blocking} message="">
                <div className="panel">
                    <div className="submit-project">
                        <div className="panel-title">
                            <span className="submit">
                                <span className="title-label">Submitted by:&nbsp;</span> 
                                <small>{props.proposal.creatorName ? props.proposal.creatorName : props.proposal.creator}</small>
                            </span>
                            <span className="price">
                                <span className="title-label">Price:&nbsp;</span>
                                <small>{props.proposal.price ? (props.proposal.price + ' ' + (prices[props.proposal.blockchain] ? prices[props.proposal.blockchain] : '')) : ''}</small>
                            </span>
                            <span className="supply">
                                <span className="title-label">Supply:&nbsp;</span>
                                <small>{props.proposal.supply}</small>
                            </span>
                        </div>
                        <Link to={`/project/${props.proposal.id}/${props.proposal.t}`}>
                            <div className="background-section" 
                                style={{
                                    backgroundImage: "url(" + (props.proposal.files ? Object.values(props.proposal.files).shift() : '') + ")",
                                    backgroundSize: "100%",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                <div className="gradient">
                                    <h3>
                                        <div className="project-name">{props.proposal.name}</div>
                                        <div className="upvote">{props.proposal.vote ? Object.values(props.proposal.vote).length : 0 }&nbsp;upvotes&nbsp;<i className="fa fa-play"></i></div>
                                    </h3>
                                    <p className="question">
                                        {props.proposal.brief}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className="rating-section">
                            <Row>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Art</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={art}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Roadmap</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={roadmap}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Utility</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={utility}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Community</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={community}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Team</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={team}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="4" xs="4" className="rating-star">
                                    <div className="one-col">
                                        <p>Originality</p>
                                        <div className="star-section">
                                            <StarRatingComponent 
                                                name="rate1" 
                                                starCount={5}
                                                value={originality}
                                                emptyStarColor={'#e5e5e5'}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </BlockUi>
        </Col>
    );
}

export default Panel;