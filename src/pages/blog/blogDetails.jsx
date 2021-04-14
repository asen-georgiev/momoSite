import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import _ from "lodash";
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
import {toast, Zoom} from "react-toastify";
import {getBlog} from "../../services/blogService";
import {picUrl} from "../../config.json";
import {createComment, getCommentsByBlog, deleteCommentUser, updateCommentUser} from "../../services/commentService";
import BlogCard from "../../components/blogCard";
import Image from 'react-bootstrap/Image'
import BlogComments from "../../components/blogComments";
import {getCurrentUser} from "../../services/userLoginService";
import jwtDecode from "jwt-decode";
import "../../css/blog/blogDetails.css";


const pictureUrl = process.env.REACT_APP_PICTURES_URL;

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
            user: {},
            updatedComment: {
                _id: '',
                commentText: '',
                user: {
                    _id: '',
                    userName: '',
                    userFamily: '',
                    userEmail: '',
                    userPicture: '',
                    userPassword: '',
                    userAddress: '',
                    userTelephone: ''
                },
                blog: ''
            },
            errors: {},
            isDisabled: true,
            isUpdated: false,
            updateButton: true
        }
    }

    schema = Joi.object({
        commentText: Joi.string()
            .min(10)
            .max(1000)
            .required()
            .label("Comment text"),
        userId: Joi.string()
            .required(),
        blogId: Joi.string()
            .required()
    });

    updatedSchema = Joi.object({
        commentText: Joi.string()
            .min(10)
            .max(1000)
            .required()
            .label("Comment text"),
        user: Joi.object()
            .keys({
                _id: Joi.string(),
                userName: Joi.string()
                    .required()
                    .min(3)
                    .max(30)
                    .trim(true)
                    .label("First name"),
                userFamily: Joi.string()
                    .required()
                    .min(3)
                    .max(30)
                    .trim(true)
                    .label("Second name"),
                userPassword: Joi.string()
                    .required()
                    .min(8)
                    .max(255)
                    .trim(true)
                    .label("Password"),
                userEmail: Joi.string()
                    .required()
                    .min(5)
                    .max(50)
                    .trim(true)
                    .label("Email"),
                userPicture: Joi.string()
                    .required()
                    .min(5)
                    .max(100)
                    .label("Profile picture"),
                userAddress: Joi.string()
                    .required()
                    .min(5)
                    .max(100)
                    .trim(true)
                    .label("Address"),
                userTelephone: Joi.string()
                    .required()
                    .min(5)
                    .max(50)
                    .trim(true)
                    .label("Personal telephone")
            }),
        blog: Joi.string()
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

        console.log(this.state.blog);
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
            toast('Your comment was successfully posted', {
                position: "top-center",
                transition: Zoom,
                className: 'blogdetails-toaster'
            });

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


    validateUpdatedComment = () => {
        const updatedComment = {
            commentText: this.state.updatedComment.commentText,
            user: {
                _id: this.state.updatedComment.user._id,
                userName: this.state.updatedComment.user.userName,
                userFamily: this.state.updatedComment.user.userFamily,
                userEmail: this.state.updatedComment.user.userEmail,
                userPicture: this.state.updatedComment.user.userPicture,
                userPassword: this.state.updatedComment.user.userPassword,
                userAddress: this.state.updatedComment.user.userAddress,
                userTelephone: this.state.updatedComment.user.userTelephone
            },
            blog: this.state.updatedComment.blog
        }
        const options = {abortEarly: false};
        const result = this.updatedSchema.validate(updatedComment, options);
        console.log(result);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    handleDeleteComment = async (comment) => {
        const allComments = this.state.comments;
        const comments = allComments.filter(c => c._id !== comment._id);
        this.setState({comments});

        try {
            await deleteCommentUser(comment._id);
            toast(`Your comment was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'blogdetails-toaster'
            });
        } catch (e) {
            if (e.response && e.response.status === 404) console.log("Comment with the given ID was not found!");
            toast.error("This comment has already been deleted");
            this.setState({comments: allComments});
        }
    }


    handleUpdateKeyPress = async(event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const errors = this.validateUpdatedComment();
            this.setState({errors: errors || {}});
            if (errors) return;

            const comment = {
                commentText: this.state.updatedComment.commentText,
                user: {
                    _id: this.state.updatedComment.user._id,
                    userName: this.state.updatedComment.user.userName,
                    userFamily: this.state.updatedComment.user.userFamily,
                    userEmail: this.state.updatedComment.user.userEmail,
                    userPicture: this.state.updatedComment.user.userPicture,
                    userPassword: this.state.updatedComment.user.userPassword,
                    userAddress: this.state.updatedComment.user.userAddress,
                    userTelephone: this.state.updatedComment.user.userTelephone
                },
                blog: this.state.updatedComment.blog
            }
            toast('Your comment was successfully updated!', {
                position: "top-center",
                transition: Zoom,
                className: 'blogdetails-toaster'
            });
            // const comments = _(this.state.comments).keyBy('_id').set(comment._id,comment).values().value();
            // this.setState({
            //     comments,
            //     isUpdated: false});
            const blogId = this.props.match.params.id;
             setTimeout(function () {
                        window.location.href = `/blog/${blogId}`;
                    }, 1500);
             await updateCommentUser(comment, this.state.updatedComment._id);

        }
    }


    handleUpdateComment = (comment) => {
        const updatedComment = {
            _id: comment._id,
            commentText: comment.commentText,
            user: {
                _id: comment.user._id,
                userName: comment.user.userName,
                userFamily: comment.user.userFamily,
                userEmail: comment.user.userEmail,
                userPicture: comment.user.userPicture,
                userPassword: comment.user.userPassword,
                userAddress: comment.user.userAddress,
                userTelephone: comment.user.userTelephone
            },
            blog: comment.blog
        }
        this.setState({
            updatedComment: updatedComment,
            isUpdated: true
        });
    }


    handleUpdateChange = (event) => {
        const updatedComment = {...this.state.updatedComment};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        updatedComment [name] = value;
        this.setState({
            updatedComment
        });
    }

    // registerRedirect = () => {
    //     this.props.history.push("/userlogin");
    // }


    render() {
        console.log(this.state.updatedComment);
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

                    <Row className="blogdetails-links-row">
                        <Col
                            style={{height: 150}}
                            className="blogdetails-links-col1 d-flex flex-column text-center justify-content-center">
                            <Link
                                className="blogdetails-links-return"
                                to="/blog">
                                I WANT TO RETURN TO BLOG PAGE
                            </Link>
                        </Col>
                        {!this.state.user._id &&
                        <Col
                            className="blogdetails-links-col2 d-flex flex-column text-center justify-content-center"
                            style={{height: 150}}>
                            <Link
                                className="blogdetails-links-comment"
                                to="/userlogin">
                                I WANT TO LEAVE A COMMENT
                            </Link>
                        </Col>}
                    </Row>
                    {this.state.user._id &&
                        <React.Fragment>
                            {!this.state.isUpdated &&
                    <Row>
                        <Col className="blogdetails-comment-col">
                            <Card className="m-4 blogdetails-comment-card">
                                <Card.Body className="d-flex flex-row">
                                    <Image
                                        src={pictureUrl + this.state.user.userPicture}
                                        style={{width: '5rem', height: '5rem'}}
                                        roundedCircle/>
                                    <Col>
                                        <Form onKeyPress={this.handleKeyPress}>
                                            <FormGroup>
                                                <FormControl
                                                    className="blogdetails-comment-formcontrol"
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
                    </Row>  }
                        </React.Fragment>}
                    {this.state.isUpdated &&
                    <Row>
                        <Col className="blogdetails-comment-col">
                            <Card className="m-4 blogdetails-comment-card">
                                <Card.Body className="d-flex flex-row">
                                    <Image
                                        src={pictureUrl + this.state.user.userPicture}
                                        style={{width: '5rem', height: '5rem'}}
                                        roundedCircle/>
                                    <Col>
                                        <Form onKeyPress={this.handleUpdateKeyPress}>
                                            <FormGroup>
                                                <FormControl
                                                    className="blogdetails-comment-formcontrol"
                                                    autoFocus={true}
                                                    name="commentText"
                                                    as="textarea"
                                                    rows="3"
                                                    value={this.state.updatedComment.commentText}
                                                    placeholder="You can leave your comment here..."
                                                    onChange={this.handleUpdateChange}/>
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
                        <Col className="blogdetails-comments-col">
                            <BlogComments
                                updateButton={this.state.updateButton}
                                user={this.state.user}
                                comments={this.state.comments}
                                deleteComment={this.handleDeleteComment}
                                updateComment={this.handleUpdateComment}
                            />
                        </Col>
                    </Row>}
                </Container>
            </div>
        );
    }
};

export default BlogDetails;
