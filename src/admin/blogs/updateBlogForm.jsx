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
import {getBlog, updateBlog} from "../../services/blogService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/blogs/blogUpdate.css";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class UpdateBlogForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: {
                blogTitle: '',
                blogSubTitle: '',
                blogText: '',
                blogPictures: [],
                blogLink: ''
            },
            showPictures: null,
            uploadPictures: null,
            errors: {},
            isDisabled: true
        }
    }

    schema = Joi.object({
        _id: Joi.string(),
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
                className: 'update-blog-toaster'
            });
        }

        const blog = {
            blogTitle: this.state.blog.blogTitle,
            blogSubTitle: this.state.blog.blogSubTitle,
            blogText: this.state.blog.blogText,
            blogPictures: this.state.blog.blogPictures,
            blogLink: this.state.blog.blogLink
        }
        toast('Blog update was successful', {
            position: "top-center",
            transition: Zoom,
            className: 'update-blog-toaster'
        });
        this.setState({
            isDisabled: true
        });
        await updateBlog(blog, this.state.blog._id);

    }


    handleImages = (event) => {

        if (this.maxSelectedFiles(event)) {
            const blog = {...this.state.blog};
            const name = event.target.name;
            const showFiles = [];
            const blogFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                showFiles.push(URL.createObjectURL(event.target.files[i]));
                blogFiles.push(event.target.files[i].name);
            }
            blog[name] = blogFiles;
            this.setState({
                blog,
                showPictures: showFiles,
                uploadPictures: event.target.files,
                isDisabled: false
            });
        }
    }


    handleChange = (event) => {
        const blog = {...this.state.blog};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        blog[name] = value;

        this.setState({
            blog,
            isDisabled: false
        });
    }


    async componentDidMount() {
        await this.populateBlog();
        console.log(this.state.blog);
    }


    async populateBlog() {
        try {
            const blogId = this.props.match.params.id;
            const {data: blog} = await getBlog(blogId);
            this.setState({
                blog: this.mapToViewModel(blog)
            });
        } catch (e) {
            if (e.response && e.response === 404)
                console.log('There is no Blog with the given ID');
        }
    }


    mapToViewModel(blog) {
        return {
            _id: blog._id,
            blogTitle: blog.blogTitle,
            blogSubTitle: blog.blogSubTitle,
            blogText: blog.blogText,
            blogPictures: blog.blogPictures,
            blogLink: blog.blogLink
        }
    }


    maxSelectedFiles = (event) => {
        let files = event.target.files;
        if (files.length > 5) {
            toast("Only 5 images can be uploaded at a time!", {
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
            _id: this.state.blog._id,
            blogTitle: this.state.blog.blogTitle,
            blogSubTitle: this.state.blog.blogSubTitle,
            blogText: this.state.blog.blogText,
            blogPictures: this.state.blog.blogPictures,
            blogLink: this.state.blog.blogLink
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
        this.props.history.push("/admin/blogslist");
    }


    render() {
        return (
            <div>
                <Container className="update-blog-main-container" fluid={true}>
                    <Container className="update-blog-sub-container">
                        <Row className="m-0">
                            <span className="update-blog-span">Update Blog :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="update-bio-div-form">

                                    {/*{this.state.showPictures === null &&*/}
                                    {/*<Card.Header className="update-blog-span m-0">*/}
                                    {/*    <span>Current blog pictures :</span>*/}
                                    {/*</Card.Header>}*/}

                                    {/*{this.state.showPictures !== null &&*/}
                                    {/*<Card.Header>*/}
                                    {/*    <span>Updated blog pictures waiting for upload :</span>*/}
                                    {/*</Card.Header>}*/}

                                    <Form onSubmit={this.handleSubmit}>

                                        {this.state.showPictures === null &&
                                        <Row className="justify-content-center">
                                            {this.state.blog.blogPictures.map(bp => {
                                                return (
                                                    <CardImg
                                                        key={bp}
                                                        className="mt-5 m-3"
                                                        style={{width: 300, height: 300}}
                                                        src={pictureUrl + bp}/>
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

                                        <FormGroup className="px-5 pt-5">
                                            <Form.File
                                                className="register-blog-form"
                                                type="file"
                                                id="images"
                                                name="blogPictures"
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
                                                value={this.state.blog.blogTitle}
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
                                                value={this.state.blog.blogSubTitle}
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
                                                value={this.state.blog.blogText}
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
                                                value={this.state.blog.blogLink}
                                                placeholder="Enter link to additional info (not mandatory)"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="update-blog-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    UPDATE BLOG
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="update-blog-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO BLOGS LIST
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

export default UpdateBlogForm;
