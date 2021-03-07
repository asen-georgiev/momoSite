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
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {createBio} from "../../services/bioService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/bios/bioRegister.css";

class RegisterBioForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioTitle: '',
            bioText: '',
            bioPictures: [],
            errors: {},
            isDisabled: true,
            showPictures: [],
            uploadPictures: null
        }
    }

    schema = Joi.object({
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
        console.log(errors);
        if (errors) return;

        const bio = {
            bioTitle: this.state.bioTitle,
            bioText: this.state.bioText,
            bioPictures: this.state.bioPictures
        }
        await createBio(bio);
        toast('New Bio was successfully created!', {
            position: "top-center",
            transition: Zoom,
            className: 'register-bio-toaster'
        });

        if (this.state.uploadPictures !== null) {
            const data = new FormData();
            for (let i = 0; i < this.state.uploadPictures.length; i++) {
                data.append('file', this.state.uploadPictures[i]);
            }
            await uploadImageAdmin(data);
            this.setState({
                isDisabled: true
            });
            toast('Images were successfully uploaded!', {
                position: "top-center",
                transition: Zoom,
                className: 'register-bio-toaster'
            });
        }
        console.log(this.state);
    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const showFiles = [];
            const bioFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                showFiles.push(URL.createObjectURL(event.target.files[i]));
                bioFiles.push(event.target.files[i].name);
            }
            this.setState({
                bioPictures: bioFiles,
                showPictures: showFiles,
                uploadPictures: event.target.files,
                isDisabled: false
            });
        }
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name

        this.setState({
            [name]: value,
            isDisabled: false
        });
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


    validateBioInput = () => {
        const bio = {
            bioTitle: this.state.bioTitle,
            bioText: this.state.bioText,
            bioPictures: this.state.bioPictures
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
        this.props.history.push("/admin");
    }


    render() {
        return (
            <div>
                <Container className="register-bio-main-container" fluid={true}>
                    <Container className="register-bio-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="register-bio-span">Create new Biography :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="register-bio-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row className="justify-content-center">
                                            {this.state.showPictures.map(sp => {
                                                return (
                                                    <CardImg
                                                        key={sp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300,height:300}}
                                                        src={sp}/>
                                                )
                                            })
                                            }
                                        </Row>
                                        <FormGroup className="px-5 pt-5">
                                            {/*<FormLabel htmlFor="images">*/}
                                            {/*    Upload images :*/}
                                            {/*</FormLabel>*/}
                                            <Form.File
                                                className="register-bio-form"
                                                type="file"
                                                id="images"
                                                name="images"
                                                label={this.state.errors.bioPictures && "You need to select images to upload!"
                                                || "Maximum images allowed to upload : 3"}
                                                multiple
                                                onChange={this.handleImages}
                                            />
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-3">
                                            {this.state.errors.bioTitle &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.bioTitle}
                                            </FormLabel>}
                                            <FormControl
                                                className="register-bio-form-control"
                                                autoFocus={true}
                                                name="bioTitle"
                                                type="text"
                                                value={this.state.bioTitle}
                                                placeholder="Enter title for the Biography"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.bioText &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.bioText}
                                            </FormLabel>}
                                            <FormControl
                                                className="register-bio-form-control"
                                                name="bioText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.bioText}
                                                placeholder="Enter text for the Biography"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="register-bio-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    CREATE BIOGRAPHY
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="register-bio-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO ADMIN PANEL
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

export default RegisterBioForm;
