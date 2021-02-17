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
import {getBio, updateBio} from "../../services/bioService";
import {uploadImageAdmin} from "../../services/imgService";

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
            .items(Joi.string())
            .required()
            .label('Bio pictures')
    })


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateBioInput();
        this.setState({errors: errors || {}});
        if (errors) return;

        const data = new FormData();
        for (let i = 0; i < this.state.uploadPictures.length; i++) {
            data.append('file', this.state.uploadPictures[i]);
        }
        await uploadImageAdmin(data);
        this.setState({
            isDisabled: true
        });
        toast.success('Images for the Bio were successfully uploaded!');

        const bio = {
            bioTitle: this.state.bio.bioTitle,
            bioText: this.state.bio.bioText,
            bioPictures: this.state.bio.bioPictures
        }
        toast.success('Bio update was successful!');
        await updateBio(bio, this.state.bio._id);

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
            })
        }
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
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            <Row>
                                <h3>Update Biography Form</h3>
                            </Row>
                            <Card>

                                {this.state.showPictures === null &&
                                <Card.Header>
                                    <span>Current bio pictures :</span>
                                </Card.Header>}

                                {this.state.showPictures !== null &&
                                <Card.Header>
                                    <span>Updated bio pictures waiting for upload :</span>
                                </Card.Header>}

                                <Card.Body>
                                    {this.state.showPictures === null &&
                                    <div>
                                        {this.state.bio.bioPictures.map(bp => {
                                            return (
                                                <CardImg
                                                    key={bp}
                                                    className="m-2"
                                                    style={{width: '20rem'}}
                                                    src={picUrl + bp}/>
                                            )
                                        })}
                                    </div>
                                    }

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
                                    </div>
                                    }

                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <FormLabel htmlFor="images">
                                                Upload images :
                                            </FormLabel>
                                            <Form.File
                                                type="file"
                                                id="images"
                                                name="bioPictures"
                                                label="Max images to upload : 3"
                                                multiple
                                                onChange={this.handleImages}/>
                                            {this.state.errors.bioPictures &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.bioPictures}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Bio title :
                                            </FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="bioTitle"
                                                type="text"
                                                value={this.state.bio.bioTitle}
                                                placeholder="Enter title for the Bio"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.bioTitle &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.bioTitle}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Bio text :
                                            </FormLabel>
                                            <FormControl
                                                name="bioText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.bio.bioText}
                                                placeholder="Enter text for the Bio"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.bioText &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.bioText}
                                            </p>}
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
                                                    BACK TO BIOS LIST
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

export default UpdateBioForm;
