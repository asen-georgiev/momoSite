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
import {picUrl} from "../../config.json";
import {getDesign, updateDesign} from "../../services/designService";
import {uploadImageAdmin} from "../../services/imgService";

class UpdateDesignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            design: {
                designTitle: '',
                designText: '',
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
        this.setState({errors: errors || {}});
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
            designTitle: this.state.design.designTitle,
            designText: this.state.design.designText,
            designPictures: this.state.design.designPictures
        }
        toast.success('Design update was successful');
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
            designPictures: design.designPictures
        }
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
            _id: this.state.design._id,
            designTitle: this.state.design.designTitle,
            designText: this.state.design.designText,
            designPictures: this.state.design.designPictures
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
                <Container className="container" fluid={true}>
                    <Card>

                        {this.state.showPictures === null &&
                        <Card.Header>
                            <span>Current Design pictures :</span>
                        </Card.Header>}

                        {this.state.showPictures !== null &&
                        <Card.Header>
                            <span>Updated Design pictures waiting for upload :</span>
                        </Card.Header>}

                        <Card.Body>

                            {this.state.showPictures === null &&
                            <div>
                                {this.state.design.designPictures.map(dp => {
                                    return (
                                        <CardImg
                                            key={dp}
                                            className="m-2"
                                            style={{width: '20rem'}}
                                            src={picUrl + dp}/>
                                    )
                                })}
                            </div>}

                            {this.state.showPictures !== null &&
                            <div>
                                {this.state.showPictures.map(sp => {
                                    return (
                                        <CardImg
                                            key={sp}
                                            className="m-2"
                                            style={{width: '20rem'}}
                                            src={sp}/>
                                    )
                                })}
                            </div>}
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormLabel>
                                        Update images :
                                    </FormLabel>
                                    <Form.File
                                        type="file"
                                        id="images"
                                        name="designPictures"
                                        label="Max images to upload : 20"
                                        multiple
                                        onChange={this.handleImages}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>
                                        Design title :
                                    </FormLabel>
                                    <FormControl
                                        autoFocus={true}
                                        name="designTitle"
                                        type="text"
                                        value={this.state.design.designTitle}
                                        placeholder="Enter title for the Design"
                                        onChange={this.handleChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>
                                        Design text :
                                    </FormLabel>
                                    <FormControl
                                        name="designText"
                                        as="textarea"
                                        rows="3"
                                        value={this.state.design.designText}
                                        placeholder="Enter text for the Design (not mandatory)"
                                        onChange={this.handleChange}/>
                                </FormGroup>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Button
                                            type="submit"
                                            disabled={this.state.isDisabled}>
                                            UPDATE
                                        </Button>
                                    </Col>
                                    <Col md={{span: 4, offset: 4}} className="d-flex flex-row-reverse">
                                        <Button
                                            onClick={this.adminRedirect}>
                                            BACK TO DESIGNS LIST
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default UpdateDesignForm;
