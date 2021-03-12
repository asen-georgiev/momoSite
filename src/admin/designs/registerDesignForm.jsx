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
import {uploadImageAdmin} from "../../services/imgService";
import {createDesign} from "../../services/designService";
import "../../css/admin/designs/designRegister.css"

const designTypes = [
    {_id: 1, type: 'photography'},
    {_id: 2, type: 'graphic design'},
    {_id: 3, type: 'prepress'}
];

class RegisterDesignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designTitle: '',
            designText: '',
            designPictures: '',
            designType: '',
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
            .max(200)
            .trim(true)
            .label('Design text'),
        designPictures: Joi.array()
            .items(Joi.string().required())
            .required()
            .label('Design pictures'),
        designType: Joi.string()
            .required()
            .min(3)
            .max(30)
            .label('Design type')
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
            toast('Images were successfully uploaded!', {
                position: "top-center",
                transition: Zoom,
                className: 'register-design-toaster'
            });
        }

        const design = {
            designTitle: this.state.designTitle,
            designText: this.state.designText,
            designPictures: this.state.designPictures,
            designType: this.state.designType
        }
        await createDesign(design);
        toast('New Design was successfully created!', {
            position: "top-center",
            transition: Zoom,
            className: 'register-design-toaster'
        });

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
            toast('Only 20 images can be uploaded!', {
                position: "top-center",
                transition: Zoom,
                className: 'error-design-toaster'
            });
            event.target.value = null;
            return false;
        }
        return true;
    }

    validateDesignInput = () => {
        const design = {
            designTitle: this.state.designTitle,
            designText: this.state.designText,
            designPictures: this.state.designPictures,
            designType: this.state.designType
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
                <Container className="register-design-main-container" fluid={true}>
                    <Container className="register-design-sub-container container">
                        <Row className="m-0">
                            <span className="register-design-span">Create new Design :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="register-design-div-form">
                                    <Form onSubmit={this.handleSubmit}>

                                        <Row className="justify-content-center">
                                            {this.state.showPictures.map(sp => {
                                                return (
                                                    <CardImg
                                                        key={sp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300, height: 300}}
                                                        src={sp}/>
                                                )
                                            })}
                                        </Row>
                                        <Row className="m-0">
                                        <FormGroup className="px-5 pt-5">
                                            <Form.File
                                                className="register-design-form"
                                                type="file"
                                                id="images"
                                                name="images"
                                                label={this.state.errors.designPictures && "You need to select images to upload!"
                                                || "Maximum images allowed to upload : 20"}
                                                multiple
                                                onChange={this.handleImages}/>
                                        </FormGroup>

                                        <FormGroup className="px-5 pt-5" as={Col}>
                                            <FormControl
                                                className="register-design-form-control-option"
                                                name="designType"
                                                as="select"
                                                onChange={this.handleChange}>
                                                <option className="register-design-option">Choose design type...</option>
                                                {designTypes.map(des => {
                                                    return (
                                                        <option
                                                            className="register-design-option"
                                                            key={des._id}
                                                            value={des.type}>
                                                            {des.type}
                                                        </option>
                                                    )
                                                })}
                                            </FormControl>
                                            {this.state.errors.designType &&
                                            <FormLabel className="text-danger pt-3">
                                                {this.state.errors.designType}
                                            </FormLabel>
                                            }
                                        </FormGroup>
                                        </Row>
                                        <FormGroup className="px-5 pt-3">
                                            {this.state.errors.designTitle &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.designTitle}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-design-form-control"
                                                autoFocus={true}
                                                name="designTitle"
                                                type="text"
                                                value={this.state.designTitle}
                                                placeholder="Enter title for the Design"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.designText &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.designText}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-design-form-control"
                                                name="designText"
                                                as="textarea"
                                                rows="3"
                                                value={this.state.designText}
                                                placeholder="Enter text for the Design (not mandatory)"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="register-design-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    CREATE DESIGN
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="register-design-redirect-button"
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

export default RegisterDesignForm;
