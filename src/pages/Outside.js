import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    const [selFileContainer, setFileContainer] = useState(null)
    const [isLoading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState('Choose File');
    const [blocking, setBlock] = useState(false)
    const [message, setMessage] = useState('Checking connnection...')

    const reset = () => {
        setProjectName('')
        setSupply('')
        setWebsite('')
        setHighlight('')
        setPrice('')
        setDropDate('')
        setDiscord('')
        setTwitter('')
        setOpensea('')
        setDescription('')
        setInputFile(document.getElementById('input-file'))
        setFiles([])
        setFileContainer(null)        
        setLoading(false)
        setBtnTitle('Choose File')
    }

    useEffect( () => {

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
    }, [props.userLoad, files] )

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

        const today = new Date();
        let load = {
            name: projectName,
            supply: supply,
            website: website,
            highlight: highlight,
            price: price,
            dropDate: dropDate,
            discord: discord,
            twitter: twitter,
            opensea: opensea,
            description: description,
            creator: props.userInfo.username,
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
            }   
        }

        load.files = fileUrl
        
        
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

        window.scrollTo(0, 0)
        NotificationManager.success('The outside project was successfully submitted.', 'Success', 5000)
        setLoading(false)
        reset()
    }

    return (
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} />
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
                                <Col lg="4" md="6" sm="12" className="main-col">
                                    <Form.Group controlId="formPrice">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="text" placeholder="How much?" value={price} onChange={changePrice} required />
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