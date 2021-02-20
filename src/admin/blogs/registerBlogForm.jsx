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
import {createBlog} from "../../services/blogService";
import {uploadImageAdmin} from "../../services/imgService";

class RegisterBlogForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogTitle: '',
            blogSubTitle: '',
            blogText: '',
            blogPictures: [],
            blogLink: '',
            errors: {},
            isDisabled: true,
            showPictures: [],
            uploadPictures: null
        }
    }

    schema = Joi.object({
        blogTitle: Joi.string()
            .required()
            .min(5)
            .max(100)
            .trim(true)
            .label('Blog title'),
        blogSubTitle: Joi.string()
            .required()
            .min(5)
            .max(100)
            .trim(true)
            .label('Blog sub title'),
        blogText: Joi.string()
            .required()
            .min(20)
            .max(2000)
            .trim(true)
            .label('Blog text'),
        blogPictures: Joi.array()
            .items(Joi.string())
            .allow('')
            .label('Blog pictures'),
        blogLink: Joi.string()
            .min(5)
            .max(50)
            .allow('')
            .label('Blog link')
    })


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateBlogInput();
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
            toast.success('Images for the Bio were successfully uploaded!');
        }

        const blog = {
            blogTitle: this.state.blogTitle,
            blogSubTitle: this.state.blogSubTitle,
            blogText: this.state.blogText,
            blogPictures: this.state.blogPictures,
            blogLink: this.state.blogLink
        }
        await createBlog(blog);
        toast.success("Blog was successfully created!");

        this.setState({
            isDisabled: true
        });
    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const showFiles = [];
            const blogFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                showFiles.push(URL.createObjectURL(event.target.files[i]));
                blogFiles.push(event.target.files[i].name);
            }
            this.setState({
                blogPictures: blogFiles,
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
        });
    }


    maxSelectedFiles = (event) => {
        let files = event.target.files;
        if (files.length > 5) {
            toast.error("Only 5 images can be uploaded at a time");
            event.target.value = null;
            return false;
        }
        return true;
    }


    validateBlogInput = () => {
        const blog = {
            blogTitle: this.state.blogTitle,
            blogSubTitle: this.state.blogSubTitle,
            blogText: this.state.blogText,
            blogPictures: this.state.blogPictures,
            blogLink: this.state.blogLink
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(blog, options);

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
                                <h3>Register Blog Form</h3>
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
                                            <FormLabel>
                                                Upload images :
                                            </FormLabel>
                                            <Form.File
                                                type="file"
                                                id="images"
                                                name="images"
                                                label="Max images to upload : 5"
                                                multiple
                                                onChange={this.handleImages}/>
                                            {this.state.errors.blogPictures &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.blogPictures}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Blog title :
                                            </FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="blogTitle"
                                                type="text"
                                                value={this.state.blogTitle}
                                                placeholder="Enter title for the Blog"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.blogTitle &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.blogTitle}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Blog sub title :
                                            </FormLabel>
                                            <FormControl
                                                name="blogSubTitle"
                                                type="text"
                                                value={this.state.blogSubTitle}
                                                placeholder="Enter sub title for the Blog"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.blogSubTitle &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.blogSubTitle}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Blog text :
                                            </FormLabel>
                                            <FormControl
                                                name="blogText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.blogText}
                                                placeholder="Enter text for the Blog"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.blogText &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.blogText}
                                            </p>}
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>
                                                Blog link :
                                            </FormLabel>
                                            <FormControl
                                                name="blogLink"
                                                type="text"
                                                value={this.state.blogLink}
                                                placeholder="Enter link to additional info"
                                                onChange={this.handleChange}
                                            />
                                            {this.state.errors.blogLink &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.blogLink}
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

export default RegisterBlogForm;
