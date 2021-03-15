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
import {picUrl} from "../../config.json";
import {getDesign, updateDesign} from "../../services/designService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/designs/designUpdate.css";

const designTypes = [
    {_id: 1, type: 'photography'},
    {_id: 2, type: 'graphic design'},
    {_id: 3, type: 'prepress'}
];

class UpdateDesignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            design: {
                designTitle: '',
                designText: '',
                designType: '',
                designPictures: []
            },
            errors: {},
            isDisabled: true,
            uploadPictures: null,
            showPictures: null
        }
    }


    schema = Joi.object({
        _id: Joi.string(),
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
                className: 'update-design-toaster'
            });
        }

        const design = {
            designTitle: this.state.design.designTitle,
            designText: this.state.design.designText,
            designPictures: this.state.design.designPictures,
            designType: this.state.design.designType
        }
        toast('Design update was successful', {
            position: "top-center",
            transition: Zoom,
            className: 'update-design-toaster'
        });
        this.setState({
            isDisabled: true
        });
        await updateDesign(design, this.state.design._id);
    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const design = {...this.state.design};
            const name = event.target.name;
            const designFiles = [];
            const showFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                designFiles.push(event.target.files[i].name);
                showFiles.push(URL.createObjectURL(event.target.files[i]));
            }
            design[name] = designFiles;
            this.setState({
                design,
                showPictures: showFiles,
                uploadPictures: event.target.files,
                isDisabled: false
            });
        }
    }


    handleChange = (event) => {
        const design = {...this.state.design};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        design[name] = value;
        this.setState({
            design,
            isDisabled: false
        })
    }


    async componentDidMount() {
        await this.populateDesign();
        console.log(this.state.design);
    }


    async populateDesign() {
        try {
            const designId = this.props.match.params.id;
            const {data: design} = await getDesign(designId);
            this.setState({
                design: this.mapToViewModel(design)
            });
        } catch (e) {
            if (e.response && e.response === 404)
                console.log('There is no Design with the given ID');
        }
    }


    mapToViewModel(design) {
        return {
            _id: design._id,
            designTitle: design.designTitle,
            designText: design.designText,
            designPictures: design.designPictures,
            designType: design.designType,
        }
    }


    maxSelectedFiles = (event) => {
        let files = event.target.files;
        if (files.length > 20) {
            toast('Only 20 images can be uploaded at a time!', {
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
            _id: this.state.design._id,
            designTitle: this.state.design.designTitle,
            designText: this.state.design.designText,
            designPictures: this.state.design.designPictures,
            designType: this.state.design.designType
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
        this.props.history.push("/admin/designslist");
    }


    render() {
        return (
            <div>
                <Container className="update-design-main-container" fluid={true}>
                    <Container className="update-design-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="update-design-span">Update Design :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="update-design-div-form">
                                    <Form onSubmit={this.handleSubmit}>

                                        {this.state.showPictures === null &&
                                        <Row className="justify-content-center">
                                            {this.state.design.designPictures.map(dp => {
                                                return (
                                                    <CardImg
                                                        key={dp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300, height: 300}}
                                                        src={picUrl + dp}/>
                                                )
                                            })}
                                        </Row>}

                                        {this.state.showPictures !== null &&
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
                                        </Row>}
                                        <Row className="m-0">
                                            <FormGroup className="px-5 pt-5">
                                                <Form.File
                                                    className="update-design-form"
                                                    type="file"
                                                    id="images"
                                                    name="designPictures"
                                                    label="Maximum images allowed to upload : 20"
                                                    multiple
                                                    onChange={this.handleImages}/>
                                            </FormGroup>
                                            <FormGroup className="px-5 pt-5" as={Col}>
                                                <FormControl
                                                    className="update-design-form-control-option"
                                                    name="designType"
                                                    as="select"
                                                    onChange={this.handleChange}>
                                                    <option
                                                        className="update-design-option">
                                                        Current : {this.state.designType}
                                                    </option>
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
                                                className="update-design-form-control"
                                                autoFocus={true}
                                                name="designTitle"
                                                type="text"
                                                value={this.state.design.designTitle}
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
                                                className="update-design-form-control"
                                                name="designText"
                                                as="textarea"
                                                rows="3"
                                                value={this.state.design.designText}
                                                placeholder="Enter text for the Design (not mandatory)"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="update-design-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    UPDATE DESIGN
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="update-design-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO DESIGNS LIST
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

export default UpdateDesignForm;
