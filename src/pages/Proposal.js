import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner, Overlay, Popover } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import ReactHtmlParser from 'react-html-parser'

const Proposal = (props) => {
    const title = "Project Proposal";
    const content = "Share alpha with the nifty fam by submitting an outside project that you think has potential!";

    const [projectName, setProjectName] = useState('');
    const [briefProjectSummary, setBriefProjectSummary] = useState('');
    const [supply, setSupply] = useState('');
    const [price, setPrice] = useState('');
    const [detailedProjectDescription, setDetailedProjectDiscription] = useState('');
    const [interest, setInterest] = useState({});
    const [inputFile, setInputFile] = useState({});
    const [files, setFiles] = useState([])
    const [selFileContainer, setFileContainer] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const [decliamer, setDecliamer] = useState(false)
    const [blocking, setBlock] = useState(false)
    const [message, setMessage] = useState('Checking connnection...')
    

    useEffect( async () => {
        
        if(props.userLoad) {
            if(props.userInfo.username) {
                setBlock(false)
                setMessage('Loading...')
            } else {
                setMessage(ReactHtmlParser("You are not registered as a Nifty member. Please sign up first. <a href='/'> Back </a>"))
                setBlock(true)
            }
        } else {
            setBlock(true)
            setMessage('Checking connnection...')
        }
        setInputFile(document.getElementById('input-file'))
        fillFileContainer()
    }, [files, props.userLoad] )
    const changeProjectName = (e) => {
        setProjectName(e.target.value);
    }

    const changeBriefProjectSummary = (e) => {
        setBriefProjectSummary(e.target.value);
    }

    const changeDecliamer = (e) => {
        setDecliamer(e.target.checked)
    }

    const changeInterest = (e) => {
        const valueString = e.target.value
        const value = valueString[0]
        const read  = document.getElementById('checkbox_interest_' + value + '_' + 'A').checked
        const write = document.getElementById('checkbox_interest_' + value + '_' + 'B').checked
        
        if(read && write) {
            interest[value] = 3
        } else if(read) {
            interest[value] = 1
        } else if(write) {
            interest[value] = 2
        } else {
            interest[value] = 0
        }

        setInterest(interest)
    }

    const changeSupply = (e) => {
        setSupply(e.target.value)
    }

    const changePrice = (e) => {
        setPrice(e.target.value)
    }

    const changeDetailedProjectDescription = (e) => {
        setDetailedProjectDiscription(e.target.value)
    }

    const changeFile = async (e) => {
        const newFile = e.target.files[0]
        let fileContainer = []
        for(let i = 0 ; i < files.length; i ++ ) {
            fileContainer.push(new File([files[i]], files[i].name))
        }
        const selectedFile = new File([newFile], newFile.name)
        fileContainer.push(selectedFile)
        setFiles(fileContainer)
    }

    const fillFileContainer = () => {
        let container = [];
        for(let i = 0; i < files.length; i ++ ) {
            const oneFile = files[i]
            const element = <Col lg="4" md="4" sm="6" xs="12"> <Button title={oneFile.name} variant="secondary"> {oneFile.name}<div><span onClick={deleteFile} title={oneFile.name} className="close-button">&#10005;</span></div> </Button></Col> 
            container.push(element)
        }

        setFileContainer(container)
    }

    const setFile = () => {
        inputFile?.click();
    }
    
    const deleteFile = async (e) => {
        const fileName = e.target.title

        console.log(fileName)
        let removeID = -1
        let fileContainer = []

        for(let i = 0 ; i < files.length; i ++ ) {
            const oneFile = files[i]
            if(fileName.trim() == oneFile.name.trim()) {
                removeID = i
                break;
            }
        }
        
        for(let i = 0; i < files.length; i ++ ) {
            if(i == removeID) {
                continue;
            }
            fileContainer.push(new File([files[i]], files[i].name))
        }
        setFiles(fileContainer)
        document.getElementById('input-file').files =  null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading('border')
        const today = new Date()
        let load = {
            name: projectName,
            supply: supply,
            brief: briefProjectSummary,
            price: price,
            description: detailedProjectDescription,
            interest: JSON.stringify(interest),
            creator: props.userInfo.username,
            creatorPath: props.userInfo.id,
            createDate : today.getFullYear() + ' / ' + (today.getMonth() + 1) + ' / ' + today.getDate()
        }

        for(let p in load) {
            if(p[1] ===  undefined) {
                window.scrollTo(0, 0)
                setLoading(false)
                NotificationManager.error('An error occurred while typing data. Please reload the page and try again.', 'Error', 5000)
                return
            }
        }
        
        let fileUrl = []
        if(files){
            for(let i = 0; i < files.length; i ++ ) {
                let file = files[i]
                let fileLink = await new Promise((resolve, reject) => {
                    const url = "/project_proposal/file/" + file.name;
                    storage.ref(url).put(file).then(function(snapshot) {
                        storage.ref(url).getDownloadURL().then((link) => {
                            console.log("resolve.......")
                        resolve(link)
                        }).catch((error) => {
                            console.log("reject.......")
                        reject('')
                        })
                    }).catch((error) => {
                        console.log("catch.......")
                        reject('')
                    })
                })

                fileUrl.push(fileLink)
            }   
        }

        load.files = fileUrl
        
        const proposalRef   = database.ref('project_proposal')
        const newProposalRef    = proposalRef.push()
        newProposalRef.set(load) 


        const memberRef = database.ref('member_profile/' + props.userInfo.id)
        let prevProjectCount = props.userInfo.project
        let projectCount
        let updateData = {}

        if(prevProjectCount == undefined) {
            projectCount = 1
        } else {
            projectCount = parseInt(prevProjectCount) + 1
        }
        updateData['project'] = projectCount
        memberRef.update(updateData)

        window.scrollTo(0, 0)
        NotificationManager.success('The project proposal was successfully submitted.', 'Success', 5000)
        setLoading(false)
        reset()
    }

    const reset = () => {
        setProjectName('');
        setSupply('');
        setPrice('');
        setBriefProjectSummary('');
        setDetailedProjectDiscription('');
        setInterest({})
        setInputFile(document.getElementById('input-file'))
        setFiles([])
        setFileContainer(null)        
        let interests = document.getElementsByClassName('form-check-input')

        for(let i = 0; i < interests.length; i ++ ) {
            interests[i].checked = false
        }
    }

    const handleClick = (e) => {
        setShow(!show);
        setTarget(e.target);
    }

    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} />
            <Container className="padding-bottom-70 proposal">
                <NotificationContainer />
                <Avatar title={title} content={content} userInfo={props.userInfo} />
                <Row className="content">
                    <BlockUi tag="div" blocking={blocking} message={message}>
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Row>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectName">
                                        <Form.Label>Project Name</Form.Label>
                                        <Form.Control type="text" placeholder="What do yo call your project?" value={projectName} onChange={changeProjectName} required />
                                    </Form.Group>
                                    <Form.Group controlId="formBriefProjectSummary" className="control-bundle">
                                        <Form.Label>Brief Project Summary</Form.Label>
                                        <Form.Control type="text" placeholder="Sum up the project in a sentence or two" value={briefProjectSummary} onChange={changeBriefProjectSummary} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formSupply">
                                        <Form.Label>Supply</Form.Label>
                                        <Form.Control type="text" placeholder="How many items in your project?" required value={supply} onChange={changeSupply} />
                                    </Form.Group>
                                    <Form.Group controlId="formPrice" className="control-bundle">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="text" placeholder="Your proposed selling price." required value={price} onChange={changePrice} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group className="mb-4">
                                        <Form.Label>Files<small> (please provide art examples or any relevant files)</small></Form.Label>
                                        <div className="footer-element file-panel">
                                            <input id="input-file" type="file" name="file" className="d-none" onChange={changeFile} multiple />
                                            <Button variant="light" id="file-upload-button" onClick={setFile}>
                                                    <div id="plus"><span>+</span></div>    
                                                Add File
                                            </Button>
                                            <Row className="selected-files">
                                                {selFileContainer}
                                            </Row>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col lg="12" md="12" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectDescription">
                                        <Form.Label>Detailed Project Discription</Form.Label>
                                        <Form.Control as="textarea" className="footer-element" placeholder="Describe all aspects of your proposed project in detail." value={detailedProjectDescription} onChange={changeDetailedProjectDescription} />
                                    </Form.Group>
                                </Col>
                                <Col lg="12" md="12" sm="12" className="main-col interest-panel">
                                    <Form.Group className="mb-4">
                                        <Form.Label>Expertise / Interest<small> (check all that apply)</small></Form.Label>
                                        <Row className="interest-body">
                                            <Col lg={4} md={6} sm={12}>
                                                have / read
                                            </Col>
                                            <Col lg={4} md={6} id="second-label">
                                                have / read
                                            </Col>
                                            <Col lg={4} id="third-label">
                                                have / read
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataA">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_A_A" value="A_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Artist" className="interest" id="checkbox_interest_A_B" value="A_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataB">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_B_A" value="B_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Game Developer" className="interest" id="checkbox_interest_B_B" value="B_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataC">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_C_A" value="C_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Community Manager" className="interest" id="checkbox_interest_C_B" value="C_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataD">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_D_A" value="D_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Project Manager" className="interest" id="checkbox_interest_D_B" value="D_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataE">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_E_A" value="E_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Musician" className="interest" id="checkbox_interest_E_B" value="E_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataF">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_F_A" value="F_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Photographer" className="interest" id="checkbox_interest_F_B" value="F_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataG">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_G_A" value="G_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Marketing Plan/ Manager" className="interest" id="checkbox_interest_G_B" value="G_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataH">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_H_A" value="H_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Business Developer" className="interest" id="checkbox_interest_H_B" value="H_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataI">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_I_A" value="I_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Social Media Manager" className="interest" id="checkbox_interest_I_B" value="I_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataJ">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_J_A" value="J_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Smart Contract Developer" className="interest" id="checkbox_interest_J_B" value="J_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataK">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_K_A" value="K_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Data Analyst" className="interest" id="checkbox_interest_K_B" value="K_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataL">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_L_A" value="L_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Discord Moderator" className="interest" id="checkbox_interest_L_B" value="L_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataM">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_M_A" value="M_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Web Developer" className="interest" id="checkbox_interest_M_B" value="M_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataN">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_N_A" value="N_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="AI Developer" className="interest" id="checkbox_interest_N_B" value="N_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataO">
                                                    <Form.Check type="checkbox" label="" className="interest" id="checkbox_interest_O_A" value="O_A" onChange={changeInterest} />
                                                    <Form.Check type="checkbox" label="Other" className="interest" id="checkbox_interest_O_B" value="O_B" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col lg="9" md="6" className="main-col"></Col>
                                <Col lg="12" className="main-col padding-bottom-20">
                                    <Link to="/" id="link">&lt;&lt;-back to projects</Link>
                                    <div className="pull-right">
                                        <div>
                                            <div class="interest form-check">
                                                <input type="checkbox" class="form-check-input" value={decliamer} onChange={changeDecliamer} />
                                                <label title="" class="form-check-label">
                                                    I have read the <span class="disclaimer" onClick={handleClick}>disclaimer</span> and I agree to the terms.
                                                </label>
                                            </div>
                                        </div>
                                        <Button variant="secondary" type="submit" disabled={!decliamer}>
                                            <Spinner
                                            as="span"
                                            animation={isLoading}
                                            size="sm"
                                            role="status"
                                            aria-hidden="false"
                                            />
                                            &nbsp; Submit</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </BlockUi>
                </Row>
            </Container>
            <Overlay
                show={show}
                target={target}
                placement="top"
                // container={ref}
                containerPadding={20}
            >
                <Popover id="popover-contained">
                <Popover.Body>
                    <p>IMPORTANT NOTICE*</p>
                    <p>MAKING A SUBMISSION, YOU ARE ACCEPTING AND AGREEING TO THE Nify, LLC TERMS OF USE. 
                        You understand that your submission is not confidential nor submitted in confidence or 
                        trust and do confidential or fiduciary relationship is intended or created by making an email
                        submission. You understand that Nifty may possess or come to possess information similar or
                        identical to information contained in your submission, and you agree that any such similarity or 
                        identity shall not give rise to any claim or entitlement,
                        whether for compensation, credit or otherwise.
                        By making a submission, you hereby release Nifty and their respective directors, officers, shareholders, employees, licensees, assigns and successors from any and all claims
                        relating to your submission, including without limitation arising from the risk of misdirection or misdelivery of 
                        your submission.
                        By checking box below and submitting this form, you acknowledge that Nifty will receive tha personal
                        information you provide in connection with this application and will use it to consider your submission as a potential project for development.
                        You also understand and agree that Nifty has the sole discretion to make determinations of participant eligibility, and that 
                        Nifty reserves the right to change any of the eligibility requirements at any time.
                    </p>
                </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

export default Proposal;