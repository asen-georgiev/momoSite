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
import {uploadImageAdmin} from "../../services/imgService";
import {createDesign} from "../../services/designService";

class RegisterDesignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designTitle: '',
            designText: '',
            designPictures: '',
            errors: {},
            isDisabled: true,
            showPictures: [],
            uploadPictures: null
        }
    }

    schema = Joi.object({
        designTitle: Joi.string()
            .required()
            .min(5)
            .max(100)
            .trim(true)
            .label('Design title'),
        designText: Joi.string()
            .allow('')
            .min(10)
            .max(100)
            .trim(true)
            .label('Design text'),
        designPictures: Joi.array()
            .items(Joi.string())
            .label('Design pictures')
    })


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateDesignInput();
        this.setState({
            errors: errors || {}
        });
        console.log(errors);
        if (errors) return;

        if (this.state.uploadPictures !== null) {
            const data = new FormData();
            for (let i = 0; i < this.state.uploadPictures.length; i++) {
                data.append('file', this.state.uploadPictures[i]);
            }
            await uploadImageAdmin(data);
            toast.success('Images for the Design were successfully uploaded!');
        }

        const design = {
            designTitle: this.state.designTitle,
            designText: this.state.designText,
            designPictures: this.state.designPictures
        }
        await createDesign(design);
        toast.success('Design was successfully created!');

        this.setState({
            isDisabled: true
        });
    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const designFiles = [];
            const showFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                designFiles.push(event.target.files[i].name);
                showFiles.push(URL.createObjectURL(event.target.files[i]));
            }
            this.setState({
                designPictures: designFiles,
                showPictures: showFiles,
                uploadPictures: event.target.files,
                isDisabled: false
            });
        }
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            isDisabled: false
        })
    }


    maxSelectedFiles = (event) => {
        let files = event.target.files;
        if (files.length > 20) {
            toast.error('Only 20 images can be uploaded!');
            event.target.value = null;
            return false;
        }
        return true;
    }

    validateDesignInput = () => {
        const design = {
            designTitle: this.state.designTitle,
            designText: this.state.designText,
            designPictures: this.state.designPictures
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(design, options);

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
                                            <FormLabel>
                                                Upload images :
                                            </FormLabel>
                                            <Form.File
                                                type="file"
                                                id="images"
                                                name="images"
                                                label="Max images to upload : 20"
                                                multiple
                                                onChange={this.handleImages}/>
                                            {this.state.errors.designPictures &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.designPictures}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Design title :
                                            </FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="designTitle"
                                                type="text"
                                                value={this.state.designTitle}
                                                placeholder="Enter title for the Design"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.designTitle &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.designTitle}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Design text :
                                            </FormLabel>
                                            <FormControl
                                                name="designText"
                                                as="textarea"
                                                rows="3"
                                                value={this.state.designText}
                                                placehodler="Enter text for the Design (not mandatory)"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.designText &&
                                            <p className="text-danger pt-2">
                                                {this.state.designText}
                                            </p>}
                                        </FormGroup>
                                        <Row className="mt-3">
                                            <Col md={4}>
                                                <Button
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    CREATE DESIGN
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

export default RegisterDesignForm;
