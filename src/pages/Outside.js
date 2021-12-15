import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { database, storage } from '../config/firebase';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import ReactHtmlParser from 'react-html-parser'

const Outside = (props) => {
    const title     = "Outside Project Submission";
    const content   = "Share alpha with the nifty fam by submitting an outside project that you think has potential!";

    const [projectName, setProjectName] = useState('');
    const [supply, setSupply] = useState('');
    const [website, setWebsite] = useState('');
    const [highlight, setHighlight] = useState('');
    const [price, setPrice] = useState('');
    const [dropDate, setDropDate] = useState('');
    const [discord, setDiscord] = useState('');
    const [twitter, setTwitter] = useState('');
    const [opensea, setOpensea] = useState('');
    const [description, setDescription] = useState('');
    const [inputFile, setInputFile] = useState({});
    const [files, setFiles] = useState([])
    const [prevFiles, setPrevFiles] = useState([])
    const [prevFileContainer, setPrevFileContainer] = useState([])
    const [selFileContainer, setFileContainer] = useState(null)
    const [isLoading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState('Choose File');
    const [blocking, setBlock] = useState(false)
    const [message, setMessage] = useState('Checking connnection...')
    const [blockchain, setBlockchain] = useState(1)
    const { id } = useParams()
    const [init, setInit] = useState(true)
    const [messageHandler, setMessageHandler] = useState(true)
    const navigate = useNavigate()

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
            const outsideRef = database.ref('project_outside/' + id)
            outsideRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const outside = snapshot.val()
                    setProjectName(outside.name)
                    setSupply(outside.supply)
                    setWebsite(outside.website)
                    setHighlight(outside.highlight)
                    setPrice(outside.price)
                    setDropDate(outside.dropDate)
                    setDiscord(outside.discord)
                    setTwitter(outside.twitter)
                    setOpensea(outside.opensea)
                    setDescription(outside.description)
                    setBlockchain(outside.blockchain)
                    
                    if(outside.files) {
                        let container = [];
                        let prevFile = []
                        for(let i in outside.fileNames) {
                            const oneFileName = outside.fileNames[i]
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
                    setInit(false)
                }
            } )
        }
        setInputFile(document.getElementById('input-file'))
        fillFileContainer()
        fillPrevFileContainer()
    }, [props.userLoad, files, prevFiles] )

    const changeProjectName = (e) => {
        setProjectName(e.target.value)
    }

    const changeSupply = (e) => {
        setSupply(e.target.value)
    }

    const changeWebsite = (e) => {
        setWebsite(e.target.value)
    }

    const changeHighlight = (e) => {
        setHighlight(e.target.value)
    }

    const changePrice = (e) => {
        setPrice(e.target.value)
    }

    const changeBlockchain = (e) => {
        setBlockchain(e.target.value)
    }

    const changeDropDate = (e) => {
        setDropDate(e.target.value)
    }

    const changeDiscord = (e) => {
        setDiscord(e.target.value)
    }

    const changeTwitter = (e) => {
        setTwitter(e.target.value)
    }

    const changeOpensea = (e) => {
        setOpensea(e.target.value)
    }

    const changeDescription = (e) => {
        setDescription(e.target.value)
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

        console.log('Hello')
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
            const fileNameRef = database.ref('project_outside/' + id + '/fileNames/' + removeID)
            fileNameRef.remove()
            const filesRef = database.ref('project_outside/' + id + '/files/' + removeID)
            filesRef.remove()
            storage.ref('project_outside/file/' + fileName).delete()
        }
        
        
        for(let i in prevFiles) {
            if(i == removeID) {
                continue;
            }
            fileContainer[i] = prevFiles[i]
        }
        setPrevFiles(fileContainer)
    } 

    const changeFile = (e) => {
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
            const element = <Col lg="4" md="4" sm="6" xs="12"> <Button title={oneFile.name} variant="secondary"><div className="cross-content"> {oneFile.name}</div><div className="cross"><span onClick={deleteFile} title={oneFile.name} className="close-button">&#10005;</span></div> </Button></Col> 
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

        const today = new Date();
        let load = {
            name: projectName,
            supply: supply,
            website: website,
            highlight: highlight,
            price: price,
            blockchain: blockchain,
            dropDate: dropDate,
            discord: discord,
            twitter: twitter,
            opensea: opensea,
            description: description,
            creator: props.userInfo.wallet,
            creatorName: props.userInfo.username,
            creatorPath: props.userInfo.id,
            createDate: today.getFullYear() + ' / ' +  (today.getMonth() + 1) + ' / ' + today.getDate()
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
                    const url = "/project_outside/file/" + file.name;
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
            const outsideRef = database.ref('project_outside/' + id + '/')
            outsideRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const prevOutside = snapshot.val()
                    if(prevOutside.files) {
                        prevOutside.files.push(...load.files)
                        prevOutside.fileNames.push(...load.fileNames)
                        load.files = prevOutside.files
                        load.fileNames = prevOutside.fileNames
                    }
                    outsideRef.update(load) 
                }
            } )
        }
        else {
            const outsideRef   = database.ref('project_outside')
            const newOutsideRef    = outsideRef.push()
            newOutsideRef.set(load) 
            
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
        navigate('/2', {replace:true})
        // reset()
    }

    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} userInfo={props.userInfo} />
            <Container className="padding-bottom-70">
                <NotificationContainer />
                <Avatar title={title} content={content} userInfo={props.userInfo} />
                <Row className="content">
                    <BlockUi tag="div" blocking={blocking} message={message}>
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Row>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectName">
                                        <Form.Label>Project Name</Form.Label>
                                        <Form.Control type="text" placeholder="Name of Project" value={projectName} onChange={changeProjectName} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formSupply">
                                        <Form.Label>Supply</Form.Label>
                                        <Form.Control type="text" placeholder="How many?" value={supply} onChange={changeSupply} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectWebsite">
                                        <Form.Label>Profile Website</Form.Label>
                                        <Form.Control type="text" placeholder="Website url" value={website} onChange={changeWebsite} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group className="mb-4" controlId="formProjectHighlights">
                                        <Form.Label>Project Highlights</Form.Label>
                                        <Form.Control type="text" placeholder="Why do you like this project?" value={highlight} onChange={changeHighlight} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="2" md="3" sm="6" className="main-col price">
                                    <Form.Group controlId="formPrice">
                                        <Form.Label>Price/ Floor</Form.Label>
                                        <Form.Control type="number" placeholder="How much?" value={price} onChange={changePrice} required />
                                    </Form.Group>
                                </Col>
                                <Col lg="2" md="3" sm="6" className="main-col blockchain">
                                    <Form.Group controlId="formBlockchain">
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
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectDropDate">
                                        <Form.Label>Project Drop Date</Form.Label>
                                        <Form.Control type="text" placeholder="When mint?" value={dropDate} onChange={changeDropDate} required/>
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectDiscord">
                                        <Form.Label>Project Discord</Form.Label>
                                        <Form.Control type="text" placeholder="Discord url" value={discord} onChange={changeDiscord} required/>
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectTwitter">
                                        <Form.Label>Project Twitter</Form.Label>
                                        <Form.Control type="text" placeholder="Twitter url" value={twitter} onChange={changeTwitter} required/>
                                    </Form.Group>
                                </Col>
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectOpensea">
                                        <Form.Label>Project OpenSea</Form.Label>
                                        <Form.Control type="text" placeholder="Opensea url" value={opensea} onChange={changeOpensea} required/>
                                    </Form.Group>
                                </Col>
                                <Col lg="12" md="12" sm="12" className="main-col">
                                    <Form.Group controlId="formProjectDescription">
                                        <Form.Label>Project Discription</Form.Label>
                                        <Form.Control as="textarea" className="footer-element" placeholder="Detailed description of the project" value={description} onChange={changeDescription} />
                                    </Form.Group>
                                </Col>
                                <Col lg="3" md="6" sm="12" className="main-col">
                                    <Form.Group className="mb-4">
                                        <Form.Label>Art Upload</Form.Label>
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
                                <Col lg="9" md="6" className="main-col"></Col>
                                <Col lg="12" className="main-col padding-bottom-20">
                                    <Link to="/" className="back">&lt;&lt;-back to projects</Link>
                                    <Button variant="secondary" type="submit" className="pull-right">
                                        <Spinner
                                        as="span"
                                        animation={isLoading}
                                        size="sm"
                                        role="status"
                                        aria-hidden="false"
                                        />
                                        &nbsp; Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </BlockUi>
                </Row>
            </Container>
        </div>
    );
}

export default Outside;