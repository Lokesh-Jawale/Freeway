import React, {useState} from 'react';
import './Give.css';
import { useHistory } from "react-router-dom";
import { Form, Button, Col, Row, ProgressBar, InputGroup } from "react-bootstrap";
import {useStateValue} from '../../StateProvider.js';
import { db, storage } from '../../firebase';
import firebase from "firebase";
import TermsNCondition from '../../TermsNCondition';
import { Helmet } from 'react-helmet';
import { giveItem } from '../../axiosJwt/apiCalls';

function Give() {

    const history = useHistory();
    const [{ basket, user }, dispatch] = useStateValue();

    const [modalShow, setModalShow] = useState(false);

    const [id, setId] = useState("");
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Others');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [condition, setCondition] = useState('Fine');
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [terms, setTerms] = useState(false);
    const [loading, setLoading] = useState(false)

    const addToBasket = () => {
        // add item to basket
        if(user){
            setLoading(true);
            // setting the id of the item
            var docId = "DOCID"+ (basket?.length+1); 

            var itemData = {donatedBy: user?.email,
                title: title,
                image: imageUrl,
                description: description,
                condition: condition,
                category: category,
                city: city,
                state: state,
                country: country
            };
            itemData = JSON.stringify(itemData)
            giveItem(itemData, user.accessToken)
            .then((status) => {
                if(status == 200){
                    setLoading(false);
                    alert("Item Donated Successfully!");
                    history.push('/browse');
                }
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
        else{
            alert('Please sign in to add the item to the Basket');
        }
    };

    // handling any non valid inputs
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form being submitted : ", imageUrl);

        const form = event.currentTarget;
        // alert(image+ " " +title + " " + description + " " +condition + " " +city + " " + form.checkValidity());
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else{
            setValidated(true);
            addToBasket();
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        var docId = "DOCID"+ (basket?.length+1);
        let currentDate = new Date();
        docId = currentDate.toDateString() + currentDate.getTime().toString()

        // handling image upload
        if(image === '' ) {
            console.error(`Not an image, the image file is a ${typeof(image)}`)
            alert(e.target.files[0] + "         dfjafj    " + image);
            return;
        }

        var uploadTask = storage.ref('images/' + docId).put(image)

        //initiates the firebase side uploading 
        uploadTask.on('state_changed', 
            (snapShot) => {
                const progress = Math.round(
                    (snapShot.bytesTransferred / snapShot.totalBytes) * 100
                );
                setProgress(progress);
            }, (err) => {
                //catches the errors
                console.log(err)
            }, () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            storage.ref('images')
                .child(docId)
                .getDownloadURL()
                .then((url) => {
                    setImageUrl(url);
                    console.log("THE IMAGE URL IS " + imageUrl);
                });
            });
        console.log("Done ");
    }

    return (
        <div className="give">
            
            <Helmet>
                <title>freeway | Give</title>
            </Helmet>

            <div className="give__donateHeader"><h2>Donate</h2></div>

            <Form className="give__formContainer" validated={validated}>

                <Row className="give__formRow mb-4">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label className="give__form__labels">Title of Object *</Form.Label>
                        <Form.Control
                            className="give__form__inputs"
                            required
                            type="text"
                            placeholder="Title of the object (max 50 letters)"
                            maxLength="60"
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid title.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label className="give__form__labels">Category</Form.Label>
                        <Form.Select 
                            className="give__form__inputs"
                            aria-label="Default select example"
                            value={category} 
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="Others">Others</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Books">Books</option>
                            <option value="Daily usables">Daily usables</option>
                            <option value="furniture">furniture</option>
                            <option value="Wearables">Wearables</option>
                            <option value="Home appliances">Home appliances</option>
                            <option value="Handicaped Supplies">Handicaped Supplies</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select a Category.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="give__formRow mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                        <Form.Label className="give__form__labels" >Description *</Form.Label>
                        <Form.Control
                            className="give__form__inputs"
                            required
                            type="text"
                            placeholder="Give a description (max letters 200)"
                            maxLength="200"
                            as="textarea" rows={3}
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please give a description.
                        </Form.Control.Feedback>

                    </Form.Group>
                </Row>

                <Row className="give__formRow mb-4">
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label className="give__form__labels">City *</Form.Label>
                        <Form.Control 
                            className="give__form__inputs"
                            type="text" 
                            placeholder="City" 
                            required
                            maxLength="50"
                            value={city} 
                            onChange={e => setCity(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="3" controlId="validationCustom05">
                        <Form.Label className="give__form__labels">State *</Form.Label>
                        <Form.Control 
                            className="give__form__inputs"
                            type="text" 
                            placeholder="State" 
                            required 
                            maxLength="50"
                            value={state} 
                            onChange={e => setState(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="3" controlId="validationCustom06">
                        <Form.Label className="give__form__labels">Country *</Form.Label>
                        <Form.Control 
                            className="give__form__inputs"
                            type="text" 
                            placeholder="Country" 
                            required 
                            maxLength="50"
                            value={country} 
                            onChange={e => setCountry(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid Country name.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="give__formRow mb-4">
                    <Form.Group as={Col} md="4" controlId="validationCustom06">
                        <Form.Label className="give__form__labels">Condition *</Form.Label>
                        <Form.Select 
                            className="give__form__inputs"
                            aria-label="Default select example"
                            value={condition} 
                            onChange={e => setCondition(e.target.value)}
                        >
                            <option value="1">Fine</option>
                            <option value="2">Good</option>
                            <option value="3">Very Good</option>
                            <option value="4">Excellent</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="formFile">
                        <Form.Label className="give__form__labels">Upload a picture *</Form.Label>
                        <InputGroup className="mb-3">      
                            <Form.Control 
                                className="give__form__inputsImage"
                                type="file"
                                required
                                onChange={e => setImage(e.target.files[0])}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please upload a picture of the giveaway object.
                            </Form.Control.Feedback>
                            <Button className="give__form__inputsUploadButton" disabled={!image} onClick={handleUpload}>
                                Upload
                            </Button>
                        </InputGroup>

                        {(image) ? <ProgressBar animated now={progress} max="100" label={`${progress}%`} /> : (<span></span>)}
                        {/* <Button disabled={!image} onClick={handleUpload} className="mt-4" type="button">Upload</Button> */}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formFileButton">
                        {/* <progress value={progress} max="100" /> */}
                    </Form.Group>

                </Row>
                <hr/>

                <div className="give__form__submit">
                    {(title && imageUrl && description && city && state && country && terms) 
                        ? (<span></span>)
                        : (<p>Please fill all the necessary fields and upload image of item to donate the item</p>)
                    }
                    <Form.Group className="terms mb-4">
                        <input
                            className="give__form__agree"
                            type="checkbox"
                            inline
                            required
                            onChange={e => setTerms(e.target.checked)}
                        />
                        <Form.Control.Feedback type="invalid">
                            You must agree before submitting.
                        </Form.Control.Feedback>
                        <span>Agree to our <span className="tnc" onClick={() => setModalShow(true)}>Terms & Conditions</span></span>
                    </Form.Group>

                    <Button disabled={!(title && imageUrl && description && city && state && country && terms)} onClick={handleSubmit} className="donateButton mb-2" type="submit">Donate</Button>
                </div>
            </Form>

            <TermsNCondition
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

        </div>
    );
}

export default Give;