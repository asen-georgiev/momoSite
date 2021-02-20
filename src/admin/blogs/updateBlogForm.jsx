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
import {getBlog, updateBlog} from "../../services/blogService";
import {uploadImageAdmin} from "../../services/imgService";

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
        this.setState({errors: errors || {}});
        if (errors) return;

        if (this.state.uploadPictures !== null) {
            const data = new FormData();
            for (let i = 0; i < this.state.uploadPictures.length; i++) {
                data.append('file', this.state.uploadPictures[i]);
            }
            await uploadImageAdmin(data);
            toast.success('Images for the Blog were successfully uploaded!');
        }

        const blog = {
            blogTitle: this.state.blog.blogTitle,
            blogSubTitle: this.state.blog.blogSubTitle,
            blogText: this.state.blog.blogText,
            blogPictures: this.state.blog.blogPictures,
            blogLink: this.state.blog.blogLink
        }
        toast.success('Blog update was successful');
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
            toast.error("Only 5 images can be uploaded at a time");
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
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            <Row>
                                <h3>Update Blog Form</h3>
                            </Row>
                            <Card>

                                {this.state.showPictures === null &&
                                <Card.Header>
                                    <span>Current blog pictures :</span>
                                </Card.Header>}

                                {this.state.showPictures !== null &&
                                <Card.Header>
                                    <span>Updated blog pictures waiting for upload :</span>
                                </Card.Header>}

                                <Card.Body>

                                    {this.state.showPictures === null &&
                                    <div>
                                        {this.state.blog.blogPictures.map(bp => {
                                            return (
                                                <CardImg
                                                    key={bp}
                                                    className="m-2"
                                                    style={{width: '20rem'}}
                                                    src={picUrl + bp}/>
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
                                                name="blogPictures"
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
                                                value={this.state.blog.blogTitle}
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
                                                value={this.state.blog.blogSubTitle}
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
                                                value={this.state.blog.blogText}
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
                                                value={this.state.blog.blogLink}
                                                placeholder="Enter link to additional info"
                                                onChange={this.handleChange}/>
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
                                                    UPDATE
                                                </Button>
                                            </Col>
                                            <Col md={{span: 4, offset: 4}} className="d-flex flex-row-reverse">
                                                <Button
                                                    onClick={this.adminRedirect}>
                                                    BACK TO BLOGS LIST
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

export default UpdateBlogForm;
