import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Joi from "joi";
import {toast, Zoom} from "react-toastify";
import {FormLabel} from "react-bootstrap";
import CardImg from "react-bootstrap/CardImg";
import {picUrl} from "../../config.json";
import {getBio, updateBio} from "../../services/bioService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/bios/bioUpdate.css";


const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class UpdateBioForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: {
                bioTitle: '',
                bioText: '',
                bioPictures: []
            },
            showPictures: null,
            uploadPictures: null,
            errors: {},
            isDisabled: true
        }
    }

    schema = Joi.object({
        _id: Joi.string(),
        bioTitle: Joi.string()
            .required()
            .min(5)
            .max(100)
            .trim(true)
            .label('Bio title'),
        bioText: Joi.string()
            .required()
            .min(10)
            .max(1024)
            .trim(true)
            .label('Bio text'),
        bioPictures: Joi.array()
            .items(Joi.string().required())
            .required()
            .label('Bio pictures')
    })


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateBioInput();
        this.setState({errors: errors || {}});
        if (errors) return;

        if (this.state.uploadPictures !== null) {
            const data = new FormData();
            for (let i = 0; i < this.state.uploadPictures.length; i++) {
                data.append('file', this.state.uploadPictures[i]);
            }
            await uploadImageAdmin(data);
            toast('Images were successfully uploaded!', {
                position: "top-center",
                transition: Zoom,
                className: 'update-bio-toaster'
            });
        }

        const bio = {
            bioTitle: this.state.bio.bioTitle,
            bioText: this.state.bio.bioText,
            bioPictures: this.state.bio.bioPictures
        }
        toast('Biography update was successful!', {
            position: "top-center",
            transition: Zoom,
            className: 'update-bio-toaster'
        });
        await updateBio(bio, this.state.bio._id);

        this.setState({
            isDisabled: true
        });

    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const bio = {...this.state.bio};
            const name = event.target.name;
            const showFiles = [];
            const bioFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                showFiles.push(URL.createObjectURL(event.target.files[i]));
                bioFiles.push(event.target.files[i].name);
            }
            bio[name] = bioFiles;
            this.setState({
                bio,
                showPictures: showFiles,
                uploadPictures: event.target.files,
                isDisabled: false
            });
        }
    }

    maxSelectedFiles = (event) => {

        let files = event.target.files;
        if (files.length > 3) {
            toast("Only 3 images can be uploaded at a time", {
                position: "top-center",
                transition: Zoom,
                className: 'error-bio-toaster'
            });
            event.target.value = null;
            return false;
        }
        return true;
    }


    handleChange = (event) => {
        const bio = {...this.state.bio};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        bio[name] = value;
        this.setState({
            bio,
            isDisabled: false
        });
    }


    async componentDidMount() {
        await this.populateBio();
        console.log(this.state.bio);
    }


    async populateBio() {
        try {
            const bioId = this.props.match.params.id;
            const {data: bio} = await getBio(bioId);
            this.setState({
                bio: this.mapToViewModel(bio)
            });
        } catch (e) {
            if (e.response && e.response === 404)
                console.log('There is no Bio with the given ID');
        }
    }


    mapToViewModel(bio) {
        return {
            _id: bio._id,
            bioTitle: bio.bioTitle,
            bioText: bio.bioText,
            bioPictures: bio.bioPictures
        }
    }


    validateBioInput = () => {
        const bio = {
            _id: this.state.bio._id,
            bioTitle: this.state.bio.bioTitle,
            bioText: this.state.bio.bioText,
            bioPictures: this.state.bio.bioPictures
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(bio, options);

        if (!result.error) return null;

        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    adminRedirect = () => {
        this.props.history.push("/admin/bioslist");
    }


    render() {
        return (
            <div>
                <Container className="update-bio-main-container" fluid={true}>
                    <Container className="update-bio-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="update-bio-span">Update Biography :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="update-bio-div-form">

                                    {/*{this.state.showPictures === null &&*/}
                                    {/*<Card.Header>*/}
                                    {/*    <span>Current bio pictures :</span>*/}
                                    {/*</Card.Header>}*/}

                                    {/*{this.state.showPictures !== null &&*/}
                                    {/*<Card.Header>*/}
                                    {/*    <span>Updated bio pictures waiting for upload :</span>*/}
                                    {/*</Card.Header>}*/}

                                    <Form onSubmit={this.handleSubmit}>
                                        {this.state.showPictures === null &&
                                        <Row className="justify-content-center">
                                            {this.state.bio.bioPictures.map(bp => {
                                                return (
                                                    <CardImg
                                                        key={bp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300,height:300}}
                                                        src={pictureUrl + bp}/>
                                                )
                                            })}
                                        </Row>
                                        }

                                        {this.state.showPictures !== null &&
                                        <Row className="justify-content-center">
                                            {this.state.showPictures.map(sp => {
                                                return (
                                                    <CardImg
                                                        key={sp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300,height:300}}
                                                        src={sp}/>
                                                )
                                            })}
                                        </Row>
                                        }
                                        <FormGroup className="px-5 pt-5">
                                            <Form.File
                                                className="update-bio-form"
                                                type="file"
                                                id="images"
                                                name="bioPictures"
                                                label="Maximum images allowed to upload : 3"
                                                multiple
                                                onChange={this.handleImages}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-3">
                                            {this.state.errors.bioTitle &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.bioTitle}
                                            </FormLabel>}
                                            <FormControl
                                                className="update-bio-form-control"
                                                autoFocus={true}
                                                name="bioTitle"
                                                type="text"
                                                value={this.state.bio.bioTitle}
                                                placeholder="Enter title for the Biography"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.bioText &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.bioText}
                                            </FormLabel>}
                                            <FormControl
                                                className="update-bio-form-control"
                                                name="bioText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.bio.bioText}
                                                placeholder="Enter text for the Biography"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="update-bio-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    UPDATE BIOGRAPHY
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="update-bio-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO BIOS LIST
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default UpdateBioForm;
