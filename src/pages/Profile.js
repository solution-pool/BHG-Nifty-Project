import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, Overlay, Popover } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom'; 
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Header from '../components/Header';
import { database, storage } from '../config/firebase';
import {getHeldAmount} from '../helpers/contract'

const Profile = (props) => {
    const [username, setUsername] = useState('')
    const [held, setHeld] = useState('')
    const [email, setEmail] = useState('')
    const [twitter, setTwitter] = useState('')
    const [bio, setBio] = useState('')
    const [inputFile, setInputFile] = useState(null);
    const [inputImage, setImageFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [prevFiles, setPrevFiles] = useState([])
    const [prevFileContainer, setPrevFileContainer] = useState([])
    const [selFileContainer, setFileContainer] = useState(null)
    const [image, setImage] = useState(null);
    const [interest, setInterest] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const [decliamer, setDecliamer] = useState(false)
    const [id, setID] = useState(0)
    const navigate = useNavigate()

    const imageRef = useRef(null)
    const walletRef = useRef(null)

    const changeUsername = (e) => {
        setUsername(e.target.value)
    }
    
    const changeTwitter = (e) => {
        setTwitter(e.target.value)
    }

    const changeEmail = (e) => {
        setEmail(e.target.value)
    }

    const changeBio = (e) => {
        setBio(e.target.value)
    }

    const changeInterest = (e) => {
        const value = e.target.value
        const checked = e.target.checked

        if(checked) {
            interest[value] = true
        } else {
            interest[value] = false
        }

        setInterest(interest)
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

    const changeImage = (e) => {
        setImage(e.target.files[0])
        const url = URL.createObjectURL(e.target.files[0])
        imageRef.current.src = url
    }
    
    const loadHeld = async() => {
        const amnt = await getHeldAmount(props.address);
        setHeld(amnt);
    }

    useEffect( async () => {
      setInputFile(document.getElementById("input-file"));
      setImageFile(document.getElementById("input-image"));
      fillPrevFileContainer()
      fillFileContainer()
      loadHeld()
      let wallet = walletRef.current.value
      if(wallet) {
            let niftyRef = database.ref('member_profile')
            await niftyRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const newArry = snapshot.val()
                    if (newArry) {
                        for(let i in newArry) {
                            let oneArry = newArry[i]
                            if(oneArry.wallet == wallet) {
                                setID(i)
                                setDecliamer(true)
                                for(let one of document.getElementsByClassName("decliamer-input")) {
                                    one.checked = true
                                }
                                imageRef.current.src = oneArry.image ? oneArry.image : require('../assets/img/avatar.png').default
                                setHeld(oneArry.held)
                                setEmail(oneArry.email)
                                setBio(oneArry.bio)
                                setTwitter(oneArry.twitter)
                                setUsername(oneArry.username)

                                if(oneArry.fileNames) {
                                    let container = [];
                                    let prevFile = []
                                    for(let i in oneArry.fileNames) {
                                        const oneFileName = oneArry.fileNames[i]
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

                                let interests = JSON.parse(oneArry.interest)
                                setInterest(interests)
                                for(let oneCheck in interests) {
                                    let checkbox = document.getElementById("checkbox_interest_" + oneCheck)
                                    checkbox.checked = interests[oneCheck]
                                }
                                break
                            } else {
                                // reset()
                            }
                        }
                    }
                }
            } ).catch( e => {
                NotificationManager.error('Network connection Failed.', 'Error', 5000)
            } )
      }
    }, [props.walletAddress, files.length, prevFiles.length]);
  
    const fillFileContainer = () => {
        let container = [];
        for(let i = 0; i < files.length; i ++ ) {
            const oneFile = files[i]
            const element = <Col lg="4" md="4" sm="6" xs="12" className="one-file"> <Button title={oneFile.name} variant="secondary"><div className="cross-content"> {oneFile.name}</div><div className="cross"><span onClick={deleteFile} title={oneFile.name} className="close-button">&#10005;</span></div> </Button></Col> 
            container.push(element)
        }

        setFileContainer(container)
    }

    const fillPrevFileContainer = () => {
        let container = [];
        for(let i in prevFiles) {
            const oneFile = prevFiles[i]
            const element = <Col lg="4" md="4" sm="6" xs="12" className="one-file"> <Button title={oneFile.name} variant="secondary"> {oneFile.name}<div><span onClick={deletePrevFile} title={oneFile.name} className="close-button">&#10005;</span></div> </Button></Col> 
            container.push(element)
        }

        setPrevFileContainer(container)
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
            const fileNameRef = database.ref('member_profile/' + id + '/fileNames/' + removeID)
            fileNameRef.remove()
            const filesRef = database.ref('member_profile/' + id + '/files/' + removeID)
            filesRef.remove()
            storage.ref('member_profile/file/' + fileName).delete()
        }
        
        
        for(let i in prevFiles) {
            if(i == removeID) {
                continue;
            }
            fileContainer[i] = prevFiles[i]
        }
        setPrevFiles(fileContainer)
    } 

    const setFile = () => {
        inputFile?.click();
    };

    const handleImage = () => {
        inputImage?.click()
    }

    const handleSubmit = async (e) => {
        setLoading('border')
        e.preventDefault()
        const jsonOfInteret = JSON.stringify(interest)
        const wallet = walletRef.current.value
        let load = {
            username : username,
            wallet : wallet,
            held : held,
            email : email,
            twitter : twitter,
            interest : jsonOfInteret,
            bio : bio,
        }

        for(let p in load) {
            if(p[1] ===  undefined) {
                window.scrollTo(0, 0)
                setLoading(false)
                NotificationManager.error('An error occurred while typing data. Please reload the page and try again.', 'Error', 5000)
                return
            }
        }

        let imageLink =  '';
        let fileUrl = []
        let fileName = []
        if(files.length){
            for(let i = 0; i < files.length; i ++ ) {
                let file = files[i]
                let fileLink = await new Promise((resolve, reject) => {
                    const url = "/member_profile/file/" + file.name;
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
                fileName.push(file.name)
            }   
        }

        load.files = fileUrl
        load.fileNames = fileName

        if(image) {
            imageLink = await new Promise((resolve, reject) => {
                const imageUrl = "/member_profile/image/" + image.name;
                storage.ref(imageUrl).put(image).then(function(snapshot) {
                    storage.ref(imageUrl).getDownloadURL().then((link) => {
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
        }

        load.image = imageLink
        load.imageName = image ? image.name : ''

        let updateFlag = false
        let niftyRef = database.ref('member_profile')
            await niftyRef.get().then( (snapshot) => {
                if(snapshot.exists) {
                    const newArry = snapshot.val()
                    if (newArry) {
                        for(let i in newArry) {
                            let oneArry = newArry[i]
                            if(oneArry.wallet == wallet) {
                                
                                updateFlag = true
                                if(oneArry.files) {
                                    oneArry.files.push(...load.files)
                                    oneArry.fileNames.push(...load.fileNames)
                                    load.files = oneArry.files
                                    load.fileNames = oneArry.fileNames
                                }

                                if(!image) {
                                    load.image = oneArry.image ? oneArry.image : ''
                                    load.imageName = oneArry.imageName ? oneArry.imageName : ''
                                }

                                let updates = {}
                                updates['member_profile/' + i] = load

                                database.ref().update(updates).then(async function(){
                                    await props.changeUserLoad(false)
                                    await props.changeReload(true)
                                    setLoading(false)
                                    navigate('/')
                                    NotificationManager.success('The member profile was successfully updated.', 'Success', 5000)
                                    window.scrollTo(0, 0)
                                }).catch(function(error) {
                                    window.scrollTo(0, 0)
                                    NotificationManager.error('The member profile submission failed.', 'Error', 5000)
                                    setLoading(false)
                                });

                                break
                            }
                        }
                    }
                }
            } )

            if(!updateFlag) {
                const userListRef   = database.ref('member_profile')
                const newUserRef    = userListRef.push()
                await newUserRef.set(load).then( async () => {
                    await props.changeUserLoad(false)
                    await props.changeReload(true)
                    setLoading(false)
                    navigate('/')
                    NotificationManager.success('The member profile was successfully submitted.', 'Success', 5000)
                    window.scrollTo(0, 0)
                } )  
            }
    }

    const handleClick = (e) => {
        setShow(!show);
        setTarget(e.target);
    }
    
    const changeDecliamer = (e) => {
        setDecliamer(e.target.checked)
    }
    return(
        <div>
            <Header walletAddress={props.walletAddress} walletConnect={props.walletConnect} userInfo={props.userInfo} />
            <Container className="profile">
                <NotificationContainer />
                <Row className="avatar-profile">
                    <h1>Nifty Profile</h1>
                    <p>
                        <span>Information collected will be used to <br />
                        communicate and collaborate on projects.
                        </span>
                        <input id="input-image" accept="image/*" type="file" name="image" className="d-none" onChange={changeImage} />
                        <img ref={imageRef} src={require('../assets/img/avatar.png').default} onClick={handleImage}/>
                    </p>
                </Row>
                <Row className="content">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col lg="8" md="12" sm="12">
                                <Row>
                                    <Col lg="6" md="6" sm="12" className="main-col">
                                        <Form.Group controlId="formWallet">
                                            <Form.Label>Wallet Address</Form.Label>
                                            <Form.Control type="text" ref={walletRef} placeholder="Wallet Address" defaultValue={props.walletAddress ? props.walletAddress : ''} required />
                                    </Form.Group>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="main-col">
                                        <Form.Group controlId="formUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" placeholder="Create a Username" value={username} onChange={changeUsername} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="main-col">
                                        <Form.Group className="mb-4" controlId="formEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="text" placeholder="Email" value={email} onChange={changeEmail} required />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="6" md="6" sm="12" className="main-col">
                                        <Form.Group className="mb-4" controlId="formTwitter">
                                            <Form.Label>Twitter</Form.Label>
                                            <Form.Control type="twitter" placeholder="Twitter URL" value={twitter} onChange={changeTwitter} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="4" md="12" sm="12" className="main-col">
                                <Row>
                                    <Col lg="12" md="12" sm="12" className="sub-main-col">
                                        <Form.Group controlId="formHeld">
                                            <Form.Label>Nodestone(s) Held</Form.Label>
                                            <Form.Control as="textarea" rows="5" disabled={true} placeholder="Nodestone(s) Held" value={held} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="12" md="12" className="main-col">
                                <Form.Group controlId="formHeld">
                                    <Form.Label>Expertise/Interest(check all that apply)</Form.Label>
                                    <Container className="checkbox-panel">
                                        <Row>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestArtist">
                                                    <Form.Check type="checkbox" label="Artist" className="interest" id="checkbox_interest_A" value="A" onChange={changeInterest} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestMusician">
                                                    <Form.Check type="checkbox" label="Musician" className="interest" id="checkbox_interest_B" value="B" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestWeb">
                                                    <Form.Check type="checkbox" label="Web Dev" className="interest" id="checkbox_interest_C" value="C" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestProject">
                                                    <Form.Check type="checkbox" label="Project Manager" className="interest" id="checkbox_interest_D" value="D" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestBusiness">
                                                    <Form.Check type="checkbox" label="Business Dev" className="interest" id="checkbox_interest_E" value="E" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestGame">
                                                    <Form.Check type="checkbox" label="Game Dev" className="interest" id="checkbox_interest_F" value="F" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestMarketing">
                                                    <Form.Check type="checkbox" label="Marketing/Promotion" className="interest" id="checkbox_interest_G" value="G" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestData">
                                                    <Form.Check type="checkbox" label="Data Analyst" className="interest" id="checkbox_interest_H" value="H" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestCollector">
                                                    <Form.Check type="checkbox" label="Collector" className="interest" id="checkbox_interest_I" value="I" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestSmart">
                                                    <Form.Check type="checkbox" label="Smart Contracts" className="interest" id="checkbox_interest_J" value="J" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestAI">
                                                    <Form.Check type="checkbox" label="AI" className="interest" id="checkbox_interest_K" value="K" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestSocial">
                                                    <Form.Check type="checkbox" label="Social Media Manager" className="interest" id="checkbox_interest_L" value="L" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestPhotographer">
                                                    <Form.Check type="checkbox" label="Photographer" className="interest" id="checkbox_interest_M" value="M" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestDiscord">
                                                    <Form.Check type="checkbox" label="Discord Mod" className="interest" id="checkbox_interest_N" value="N" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" className="checkbox-col">
                                                <Form.Group className="mb-3" controlId="formInterestOther">
                                                    <Form.Check type="checkbox" label="Other" className="interest" id="checkbox_interest_O" value="O" onChange={changeInterest}  />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Form.Group>
                            </Col>
                            <Col lg="4" className="main-col">
                                <Form.Group className="mb-4">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control className="footer-element" as="textarea" rows={3} placeholder="Bio" value={bio} onChange={changeBio} />
                                </Form.Group>
                            </Col>
                            <Col lg="8" className="main-col decliamer-panel">
                                <Form.Group className="mb-4">
                                    <Form.Label>Files</Form.Label>
                                    <span id="up-decliamer">
                                        <label title="" className="form-check-label">
                                            &nbsp;I have read the <span className="disclaimer" onClick={handleClick}>disclaimer</span> and I agree to the terms.
                                        </label>
                                        <input type="checkbox" className="form-check-input decliamer-input" value={decliamer} onChange={changeDecliamer} required />
                                    </span>
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
                                    <span id="down-decliamer">
                                        <input type="checkbox" className="form-check-input decliamer-input" value={decliamer} onChange={changeDecliamer} />
                                        <label title="" className="form-check-label">
                                            &nbsp;I have read the <span className="disclaimer" onClick={handleClick}>disclaimer</span> and I agree to the terms.
                                        </label>
                                    </span>
                                </Form.Group>
                            </Col>
                            <Col lg="12" className="main-col submit-button-panel">
                                <Form.Group className="mb-4">
                                    <Form.Label style={{visibility:'hidden'}}>Bio</Form.Label>
                                    <div className="footer-element">
                                        <Link to="/" className="back">&lt;&lt;-back to projects</Link>
                                        <Button variant="secondary" type="submit"  disabled={!decliamer}>
                                            <Spinner
                                            as="span"
                                            animation={isLoading}
                                            size="sm"
                                            role="status"
                                            aria-hidden="false"
                                            />
                                            &nbsp; Save Changes</Button>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Row>
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
            </Container>
        </div>
    );
}

export default Profile;