import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Joi from "joi";
import {toast} from "react-toastify";
import {FormLabel} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {createBio} from "../../services/bioService";
import {uploadImageAdmin} from "../../services/imgService";

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
            .items(Joi.string())
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
        toast.success('Bio was successfully created!');

        const data = new FormData();
        for (let i = 0; i < this.state.uploadPictures.length; i++) {
            data.append('file', this.state.uploadPictures[i]);
        }
        await uploadImageAdmin(data);
        this.setState({
            isDisabled: true
        });
        toast.success('Images for the Bio were successfully uploaded!');

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
            })
        }
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name

        this.setState({
            [name]: value,
            isDisabled: false
        })
    }


    maxSelectedFiles = (event) => {

        let files = event.target.files;
        if (files.length > 3) {
            toast.error("Only 3 images can be uploaded at a time");
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
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            <Row>
                                <h3>Register Biography Form</h3>
                            </Row>
                            <Card>
                                {this.state.uploadPictures !== null &&
                                <Card.Header>
                                    <span>Images waiting for upload :</span>
                                </Card.Header>}
                                <Card.Body>
                                    {this.state.showPictures.map(sp => {
                                        return (
                                            <CardImg
                                                key={sp}
                                                className="m-2"
                                                style={{width: '20rem'}}
                                                src={sp}/>
                                        )
                                    })
                                    }
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <FormLabel htmlFor="images">
                                                Upload images :
                                            </FormLabel>
                                            <Form.File
                                                type="file"
                                                id="images"
                                                name="images"
                                                label="Max images to upload : 3"
                                                multiple
                                                onChange={this.handleImages}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Bio title :
                                            </FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="bioTitle"
                                                type="text"
                                                value={this.state.bioTitle}
                                                placeholder="Enter title for the Bio"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Bio text :
                                            </FormLabel>
                                            <FormControl
                                                name="bioText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.bioText}
                                                placeholder="Enter text for the Bio"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="mt-3">
                                            <Col md={4}>
                                                <Button
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    SUBMIT
                                                </Button>
                                            </Col>
                                            <Col md={{span: 4, offset: 4}} className="d-flex flex-row-reverse">
                                                <Button
                                                    onClick={this.adminRedirect}>
                                                    BACK TO ADMIN PANEL
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default RegisterBioForm;
