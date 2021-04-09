import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {toast, Zoom} from "react-toastify";
import {getCurrentUser, userLogout} from "../../services/userLoginService";
import jwtDecode from "jwt-decode";
import {picUrl} from "../../config.json";
import Usercard from "../../components/usercard";
import '../../css/user/userProfile.css'
import {deleteUser} from "../../services/userService";
import UserDeleteAlert from "../../components/userDeleteAlert";
import {Link} from "react-router-dom";
import {deleteCommentUser, getCommentsByUser} from "../../services/commentService";
import BlogComments from "../../components/blogComments";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedUser: [],
            comments: [],
            url: '',
            showAlert: false,
            isLogged: false
        }
    }

    async componentDidMount() {
        const url = pictureUrl;
        const jwtUser = getCurrentUser();
        const loggedUser = jwtDecode(jwtUser);
        const {data: comments} = await getCommentsByUser(loggedUser._id)
        this.setState({loggedUser, url, comments, isLogged: true});
    }

    handleDelete = async (user) => {
        const usr = this.state.loggedUser;
        this.setState({loggedUser: []});
        try {
            await deleteUser(user._id)
            userLogout();
        } catch (e) {
            if (e.response && e.response.status === 404)
                console.log('User with the given ID was not found');
            toast.error('This user has already been deleted!');
            this.setState({loggedUser: usr});
        }
    }


    showAlert = (boolean) => {
        window.scrollTo({top: 0});
        this.setState({showAlert: boolean})
    }


    handleDeleteComment = async (comment) => {
        const allComments = this.state.comments;
        const comments = allComments.filter(c => c._id !== comment._id);
        this.setState({comments});

        try{
            await deleteCommentUser(comment._id);
            toast(`Your comment was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'user-profile-toaster'
            });
        } catch (e) {
            if(e.response && e.response.status === 404) console.log("Comment with the given ID was not found!");
            toast.error("This comment has already been deleted");
            this.setState({comments: allComments});
        }
    }

    render() {
        return (
            <div>
                <Container className="user-profile-main" fluid={true}>
                    <Row className="justify-content-center user-profile-alert-row">
                        <UserDeleteAlert
                            heading="Are you sure you want to delete your profile?"
                            showAlert={this.state.showAlert}
                            buttonYes="YES, I want"
                            buttonNo="NO, it was a mistake"
                            onYes={() => this.handleDelete(this.state.loggedUser)}
                            onNo={() => this.showAlert(false)}
                            buttonYesVariant="info"
                            buttonNoVariant="danger"/>
                    </Row>
                    <Row>
                        <Col className="user-profile-col-card">
                            <Usercard
                                src={this.state.url + this.state.loggedUser.userPicture}
                                loggedUser={this.state.loggedUser}/>
                        </Col>
                        <Col className="user-profile-col-comm pb-4">
                            <Row className="user-profile-rowspan justify-content-center">
                                <span>
                                    MY COMMENTS
                                </span>
                            </Row>
                            <Row>
                                <Col
                                    className="overflow-auto"
                                    style={{height: 630}}>
                                    <BlogComments
                                        comments={this.state.comments}
                                        user={this.state.loggedUser}
                                        deleteComment={this.handleDeleteComment}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="user-profile-update text-center p-5">
                            <Link
                                className="user-profile-update-link"
                                to={`/userprofile/${this.state.loggedUser._id}`}>
                                UPDATE PROFILE
                            </Link>
                        </Col>
                        <Col className="user-profile-delete text-center p-5">
                            <Link
                                className="user-profile-delete-link"
                                onClick={() => this.showAlert(true)}>
                                DELETE PROFILE
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default UserProfile;
