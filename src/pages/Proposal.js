import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner, Overlay, Popover } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import ReactHtmlParser from 'react-html-parser'

const Proposal = (props) => {
    const title = "Project Proposal";
    const content = "Submit a project to the Nifty community for consideration.";

    const [projectName, setProjectName] = useState('');
    const [briefProjectSummary, setBriefProjectSummary] = useState('');
    const [supply, setSupply] = useState('');
    const [price, setPrice] = useState('');
    const [blockchain, setBlockchain] = useState(1)
    const [detailedProjectDescription, setDetailedProjectDiscription] = useState('');
    const [interest, setInterest] = useState({});
    const [inputFile, setInputFile] = useState({});
    const [files, setFiles] = useState([])
    const [prevFiles, setPrevFiles] = useState([])
    const [prevFileContainer, setPrevFileContainer] = useState([])
    const [selFileContainer, setFileContainer] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const [decliamer, setDecliamer] = useState(false)
    const [blocking, setBlock] = useState(false)
    const { id } = useParams()
    const [init, setInit] = useState(true)
    const [messageHandler, setMessageHandler] = useState(true)
    const navigate = useNavigate();
    

    useEffect( () => {
        
        if(props.userLoad == true) {
            if(props.userInfo.wallet) {
                setBlock(false)
            } else {
                setBlock(true)
                if(messageHandler) {
                    NotificationManager.error('You are not registered as a Nifty member. Please sign up first.', 'Error', 5000)
                    setMessageHandler(false)
                }
            }
        } else if(props.userLoad == -1) {
            setBlock(true)
            if(messageHandler) {
                NotificationManager.error('You are not registered as a Nifty member. Please sign up first.', 'Error', 5000)
                setMessageHandler(false)
            }
        } else if(props.userLoad == -2) {
            setBlock(true)
            if(messageHandler) {
                NotificationManager.error('Network connection Failed!', 'Error', 5000)
                setMessageHandler(false)
            }
 
        } else {
            setBlock(true)
        }

        if(id && init) {
            const proposalRef = database.ref('project_proposal/' + id)
            proposalRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const proposal = snapshot.val()

                    setDecliamer(true)
                    
                    for(let one of document.getElementsByClassName("decliamer-input")) {
                        one.checked = true
                    }

                    setProjectName(proposal.name)
                    setBriefProjectSummary(proposal.brief)
                    setSupply(proposal.supply)
                    setPrice(proposal.price)
                    setBlockchain(proposal.blockchain)
                    setDetailedProjectDiscription(proposal.description)
                    
                    if(proposal.files) {
                        let container = [];
                        let prevFile = []
                        for(let i in proposal.fileNames) {
                            const oneFileName = proposal.fileNames[i]
                            const element = 
                                    <Col lg="4" md="4" sm="6" xs="12" className="one-file"> 
                                        <Button title={oneFileName} variant="secondary">
                                            <div className="cross-content"> {oneFileName}</div>
                                            <div className="cross">
                                                <span onClick={deletePrevFile} title={oneFileName} className="close-button">
                                                    &#10005;
                                                </span>
                                            </div> 
                                        </Button>
                                    </Col> 
                            container.push(element)
                            prevFile[i] = {name : oneFileName}
                        }
                        setPrevFileContainer(container)
                        setPrevFiles(prevFile)
                    }

                    let interests = JSON.parse(proposal.interest)
                    setInterest(interests)
                    for(let oneCheck in interests) {
                        let checkbox = document.getElementById("checkbox_interest_" + oneCheck + '_' + interests[oneCheck])
                        checkbox.checked = true
                    }
                    setInit(false)
                }
            } )
        }
        setInputFile(document.getElementById('input-file'))
        fillFileContainer()
        fillPrevFileContainer()
    }, [files, props.userLoad, prevFiles] )
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
        const value = e.target.value
        const name = e.target.name

        if(interest[name] == undefined ||
            interest[name] != value) {
                interest[name] = value
        } else {
            delete interest[name]
            e.target.checked = false
        }
        // if value is A, it reflects 'have', then if value is 'B' it reflects 'need' 
        
        setInterest(interest)
    }

    const changeSupply = (e) => {
        setSupply(e.target.value)
    }

    const changePrice = (e) => {
        setPrice(e.target.value)
    }

    const changeBlockchain = (e) => {
        setBlockchain(e.target.value)
    }

    const changeDetailedProjectDescription = (e) => {
        setDetailedProjectDiscription(e.target.value)
    }
      
    const fillPrevFileContainer = () => {
        let container = [];
        for(let i in prevFiles) {
            const oneFile = prevFiles[i]
            const element = <Col lg="4" md="4" sm="6" xs="12" className="one-file"> 
                                <Button title={oneFile.name} variant="secondary"> 
                                    <div className="cross-content">{oneFile.name}</div>
                                    <div className="cross">
                                        <span onClick={deletePrevFile} title={oneFile.name} className="close-button">&#10005;</span>
                                    </div> 
                                </Button>
                            </Col> 
            container.push(element)
        }

        setPrevFileContainer(container)
    }
    
    const deletePrevFile = async (e) => {
        const fileName = e.target.title

        let removeID = -1
        let fileContainer = []

        for(let i in prevFiles) {
            const oneFile = prevFiles[i]
            if(fileName.trim() == oneFile.name.trim()) {
                removeID = i
                break;
            }
        }

        if(removeID > -1) {
            const fileNameRef = database.ref('project_proposal/' + id + '/fileNames/' + removeID)
            fileNameRef.remove()
            const filesRef = database.ref('project_proposal/' + id + '/files/' + removeID)
            filesRef.remove()
            storage.ref('project_proposal/file/' + fileName).delete()
        }
        
        
        for(let i in prevFiles) {
            if(i == removeID) {
                continue;
            }
            fileContainer[i] = prevFiles[i]
        }
        setPrevFiles(fileContainer)
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
            const element = <Col lg="4" md="4" sm="6" xs="12" className="one-file"> <Button title={oneFile.name} variant="secondary"><div className="cross-content"> {oneFile.name}</div><div className="cross"><span onClick={deleteFile} title={oneFile.name} className="close-button">&#10005;</span></div> </Button></Col> 
            container.push(element)
        }

        setFileContainer(container)
    }

    const setFile = () => {
        inputFile?.click();
    }
    
    const deleteFile = async (e) => {
        const fileName = e.target.title

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
            blockchain: blockchain,
            description: detailedProjectDescription,
            interest: JSON.stringify(interest),
            creator: props.userInfo.wallet,
            creatorName: props.userInfo.username,
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
        let fileNames = []
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
                fileNames.push(file.name)
            }   
        }

        load.files = fileUrl
        load.fileNames = fileNames
        

        if(id && !init) {
            const proposalRef = database.ref('project_proposal/' + id + '/')
            proposalRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const prevProposal = snapshot.val()
                    if(prevProposal.files) {
                        prevProposal.files.push(...load.files)
                        prevProposal.fileNames.push(...load.fileNames)
                        load.files = prevProposal.files
                        load.fileNames = prevProposal.fileNames
                    }
                    proposalRef.update(load) 
                }
            } )
        }
        else {
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
        }
        setLoading(false)
        navigate('/1', {replace: true})
    }

    const handleClick = (e) => {
        setShow(!show);
        setTarget(e.target);
    }

    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} userInfo={props.userInfo} />
            <Container className="padding-bottom-70 proposal">
                <NotificationContainer />
                <Avatar title={title} content={content} userInfo={props.userInfo} />
                <Row className="content">
                    <BlockUi tag="div" blocking={blocking}>
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
                                    <Row>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Form.Group controlId="formPrice" className="control-bundle">
                                                <Form.Label>Price/ Floor</Form.Label>
                                                <Form.Control type="text" placeholder="Your proposed selling price." required value={price} onChange={changePrice} />
                                            </Form.Group>
                                        </Col> 
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Form.Group controlId="formBlockchain" className="control-bundle">
                                                <Form.Label>Blockchain</Form.Label>
                                                <Form.Select value={blockchain} onChange={changeBlockchain}>
                                                    <option value="1">Ethereum</option>
                                                    <option value="2">Cardano</option>
                                                    <option value="3">Binance</option>
                                                    <option value="4">Polygon</option>
                                                    <option value="5">Solana</option>
                                                    <option value="6">Immutable X</option>
                                                    <option value="7">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col> 
                                    </Row>
                                </Col>
                                <Col lg="4" md="12" sm="12" className="main-col">
                                    <Form.Group className="mb-4">
                                        <Form.Label>Files<small> (please provide art examples or any relevant files)</small></Form.Label>
                                        <div className="footer-element file-panel">
                                            <input id="input-file" type="file" name="file" className="d-none" onChange={changeFile} multiple />
                                            <Button variant="light" id="file-upload-button" onClick={setFile}>
                                                    <div id="plus"><span>+</span></div>    
                                                Add File
                                            </Button>
                                            <Row className="selected-files">
                                                {prevFileContainer}
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
                                                have / need
                                            </Col>
                                            <Col lg={4} md={6} id="second-label">
                                                have / need
                                            </Col>
                                            <Col lg={4} id="third-label">
                                                have / need
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <div class="interest">
                                                        <input name="A" type="radio" id="checkbox_interest_A_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="A" type="radio" id="checkbox_interest_A_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Artist</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <div class="interest">
                                                        <input name="B" type="radio" id="checkbox_interest_B_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="B" type="radio" id="checkbox_interest_B_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Game Developer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataC">
                                                    <div class="interest">
                                                        <input name="C" type="radio" id="checkbox_interest_C_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="C" type="radio" id="checkbox_interest_C_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Community Manager</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataD">
                                                    <div class="interest">
                                                        <input name="D" type="radio" id="checkbox_interest_D_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="D" type="radio" id="checkbox_interest_D_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Project Manager</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataE">
                                                    <div class="interest">
                                                        <input name="E" type="radio" id="checkbox_interest_E_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="E" type="radio" id="checkbox_interest_E_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Musician</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataF">
                                                    <div class="interest">
                                                        <input name="F" type="radio" id="checkbox_interest_F_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="F" type="radio" id="checkbox_interest_F_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Photographer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataG">
                                                    <div class="interest">
                                                        <input name="G" type="radio" id="checkbox_interest_G_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="G" type="radio" id="checkbox_interest_G_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Marketing Plan/ Manager</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataH">
                                                    <div class="interest">
                                                        <input name="H" type="radio" id="checkbox_interest_H_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="H" type="radio" id="checkbox_interest_H_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Business Developer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataI">
                                                    <div class="interest">
                                                        <input name="I" type="radio" id="checkbox_interest_I_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="I" type="radio" id="checkbox_interest_I_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Social Media Manager</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataJ">
                                                    <div class="interest">
                                                        <input name="J" type="radio" id="checkbox_interest_J_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="J" type="radio" id="checkbox_interest_J_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Smart Contract Developer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataK">
                                                    <div class="interest">
                                                        <input name="K" type="radio" id="checkbox_interest_K_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="K" type="radio" id="checkbox_interest_K_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Data Analyst</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataL">
                                                    <div class="interest">
                                                        <input name="L" type="radio" id="checkbox_interest_L_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="L" type="radio" id="checkbox_interest_L_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Discord Moderator</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataM"> 
                                                    <div class="interest">
                                                        <input name="M" type="radio" id="checkbox_interest_M_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="M" type="radio" id="checkbox_interest_M_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Web Developer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataN">
                                                    <div class="interest">
                                                        <input name="N" type="radio" id="checkbox_interest_N_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="N" type="radio" id="checkbox_interest_N_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">AI Developer</label>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formInterestDataO">
                                                    <div class="interest">
                                                        <input name="O" type="radio" id="checkbox_interest_O_A" className="form-check-input first" value="A" onClick={changeInterest} />
                                                        <input name="O" type="radio" id="checkbox_interest_O_B" className="form-check-input second" value="B" onClick={changeInterest} />
                                                    </div>
                                                    <label title="" className="form-check-label">Other</label>
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
                                            <div className="interest form-check">
                                                <input type="checkbox" className="form-check-input decliamer-input" value={decliamer} onChange={changeDecliamer} />
                                                <label title="" className="form-check-label">
                                                    I have read the <span className="disclaimer" onClick={handleClick}>disclaimer</span> and I agree to the terms.
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
                    <p>MAKING A SUBMISSION, YOU ARE ACCEPTING AND AGREEING TO THE Nifty, LLC TERMS OF USE. 
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