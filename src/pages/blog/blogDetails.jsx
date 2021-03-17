import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {toast} from "react-toastify";
import {getBlog} from "../../services/blogService";
import {picUrl} from "../../config.json";
import {createComment, getCommentsByBlog} from "../../services/commentService";
import BlogCard from "../../components/blogCard";
import Image from 'react-bootstrap/Image'
import BlogComments from "../../components/blogComments";
import {getCurrentUser} from "../../services/userLoginService";
import jwtDecode from "jwt-decode";
import "../../css/blog/blogDetails.css";

class BlogDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: '',
            comments: [],
            comment: {
                commentText: '',
                userId: '',
                blogId: ''
            },
            user: null,
            errors: {},
            isDisabled: true
        }
    }

    schema = Joi.object({
        commentText: Joi.string()
            .min(10)
            .max(1000)
            .required(),
        userId: Joi.string()
            .required(),
        blogId: Joi.string()
            .required()
    })


    async componentDidMount() {
        const blogId = this.props.match.params.id;
        const {data: blog} = await getBlog(blogId);
        const {data: comments} = await getCommentsByBlog(blogId);
        const jwtUser = getCurrentUser();
        if (jwtUser !== null) {
            const user = jwtDecode(jwtUser);
            this.setState({user});
            console.log(user);
        }
        this.setState({
            blog,
            comments
        });

        console.log(this.state.user);
    }

    handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const errors = this.validateCommentInput();
            this.setState({errors: errors || {}});
            if (errors) return;

            const comment = {
                commentText: this.state.comment.commentText,
                userId: this.state.user._id,
                blogId: this.props.match.params.id
            };
            await createComment(comment);
            toast.success('Your comment was successfully posted');

            const blogId = this.props.match.params.id;
            const {data: comments} = await getCommentsByBlog(blogId);

            const emptyComment = {
                commentText: '',
                userId: '',
                blogId: ''
            }

            this.setState({
                comments,
                comment: emptyComment
            });
        }
    }


    handleChange = (event) => {
        const comment = {};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        comment [name] = value;
        this.setState({
            comment
        })
    }


    validateCommentInput = () => {
        const blogId = this.props.match.params.id;
        const comment = {
            commentText: this.state.comment.commentText,
            userId: this.state.user._id,
            blogId: blogId
        }
        const options = {abortEarly: false};
        const result = this.schema.validate(comment, options);
        console.log(result);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    registerRedirect = () => {
        this.props.history.push("/userlogin");
    }


    render() {
        return (
            <div>
                <Container className="blogdetails-main" fluid={true}>
                    <Row>
                        <Col className="blogdetails-card-col">
                            <BlogCard
                                className="blogdetails-card m-4"
                                items={this.state.blog}/>
                        </Col>
                    </Row>
                    {!this.state.user &&
                    <Row className="blogdetails-links-row">
                        <Col
                            className="blogdetails-links-col1 d-flex flex-column text-center justify-content-center"
                        >
                            <Link
                                className="blogdetails-links-return"
                                to="/blog">
                                I WANT TO RETURN TO BLOG PAGE
                            </Link>
                        </Col>
                        <Col
                            className="blogdetails-links-col2 d-flex flex-column text-center justify-content-center"
                            style={{height: 150}}>
                            <Link
                                className="blogdetails-links-comment"
                                to="/userlogin">
                                I WANT TO LEAVE A COMMENT
                            </Link>
                        </Col>
                    </Row>}
                    {this.state.user &&
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body className="d-flex flex-row">
                                    <Image
                                        src={picUrl + this.state.user.userPicture}
                                        style={{width: '5rem', height: '5rem'}}
                                        roundedCircle/>
                                    <Col>
                                        <Form onKeyPress={this.handleKeyPress}>
                                            <FormGroup>
                                                <FormControl
                                                    autoFocus={true}
                                                    name="commentText"
                                                    as="textarea"
                                                    rows="3"
                                                    value={this.state.comment.commentText}
                                                    placeholder="You can leave your comment here..."
                                                    onChange={this.handleChange}/>
                                                {this.state.errors.commentText &&
                                                <p className="text-danger pt-2">
                                                    {this.state.errors.commentText}
                                                </p>}
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>}
                    {this.state.comments &&
                    <Row>
                        <Col>
                            <BlogComments
                                comments={this.state.comments}
                            />
                        </Col>
                    </Row>}
                </Container>
            </div>
        );
    }
};

export default BlogDetails;
