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
import {createBlog} from "../../services/blogService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/blogs/blogRegister.css"

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
            .max(200)
            .trim(true)
            .label('Blog sub title'),
        blogText: Joi.string()
            .required()
            .min(20)
            .max(5000)
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
            toast('Images were successfully uploaded!', {
                position: "top-center",
                transition: Zoom,
                className: 'register-blog-toaster'
            });
        }

        const blog = {
            blogTitle: this.state.blogTitle,
            blogSubTitle: this.state.blogSubTitle,
            blogText: this.state.blogText,
            blogPictures: this.state.blogPictures,
            blogLink: this.state.blogLink
        }
        await createBlog(blog);
        toast.success("New Blog was successfully created!", {
            position: "top-center",
            transition: Zoom,
            className: 'register-blog-toaster'
        });

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
            toast.error("Only 5 images can be uploaded at a time!", {
                position: "top-center",
                transition: Zoom,
                className: 'error-blog-toaster'
            });
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
                <Container className="register-blog-main-container" fluid={true}>
                    <Container className="register-blog-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="register-blog-span">Create new Blog :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="register-blog-div-form">
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

                                        <FormGroup className="px-5 pt-5">
                                            <Form.File
                                                className="register-blog-form"
                                                type="file"
                                                id="images"
                                                name="images"
                                                label={this.state.errors.blogPictures
                                                || "Maximum images allowed to upload : 5 (not mandatory)"}
                                                multiple
                                                onChange={this.handleImages}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-3">
                                            {this.state.errors.blogTitle &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.blogTitle}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-blog-form-control"
                                                autoFocus={true}
                                                name="blogTitle"
                                                type="text"
                                                value={this.state.blogTitle}
                                                placeholder="Enter title for the Blog"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.blogSubTitle &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.blogSubTitle}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-blog-form-control"
                                                name="blogSubTitle"
                                                type="text"
                                                value={this.state.blogSubTitle}
                                                placeholder="Enter short expose for the Blog"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.blogText &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.blogText}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-blog-form-control"
                                                name="blogText"
                                                as="textarea"
                                                rows="5"
                                                value={this.state.blogText}
                                                placeholder="Enter main text for the Blog"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {this.state.errors.blogLink &&
                                            <FormLabel className="text-danger">
                                                {this.state.errors.blogLink}
                                            </FormLabel>
                                            }
                                            <FormControl
                                                className="register-blog-form-control"
                                                name="blogLink"
                                                type="text"
                                                value={this.state.blogLink}
                                                placeholder="Enter link to additional info (not mandatory)"
                                                onChange={this.handleChange}
                                            />
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="register-blog-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    CREATE BLOG
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="register-blog-redirect-button"
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

export default RegisterBlogForm;
