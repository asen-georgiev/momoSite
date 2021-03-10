import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import {getCurrentUser, userLogout} from "../../services/userLoginService";
import jwtDecode from "jwt-decode";
import {picUrl} from "../../config.json";
import Usercard from "../../components/usercard";
import '../../css/user/userProfile.css'
import {deleteUser} from "../../services/userService";
import UserDeleteAlert from "../../components/userDeleteAlert";
import {Link} from "react-router-dom";
import {getCommentsByUser} from "../../services/commentService";
import BlogComments from "../../components/blogComments";


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
        const url = picUrl;
        const jwtUser = getCurrentUser();
        const loggedUser = jwtDecode(jwtUser);
        const {data: comments} = await getCommentsByUser(loggedUser._id)
        this.setState({loggedUser, url, comments,isLogged:true});
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
        this.setState({showAlert: boolean})
    }

    logoutUser = () => {
        userLogout();
        this.setState({isLogged:false});
        this.props.history.push("/");
    }


    render() {
        return (
            <div>
                <Container>
                    <Row className="justify-content-center">
                        <UserDeleteAlert
                            heading="Are you sure you want to delete your profile?"
                            showAlert={this.state.showAlert}
                            variant="danger"
                            buttonYes="Qj laina!"
                            buttonNo="Ne qj laina!"
                            onYes={() => this.handleDelete(this.state.loggedUser)}
                            onNo={() => this.showAlert(false)}
                            buttonYesVariant="info"
                            buttonNoVariant="danger"/>
                    </Row>
                    <Row className="justify-content-center bg-secondary">
                        <Usercard
                            className="d-flex flex-row user-profile-card"
                            src={this.state.url + this.state.loggedUser.userPicture}
                            imgWidth={'20rem'}
                            loggedUser={this.state.loggedUser}/>
                    </Row>
                    <Row className="bg-dark d-flex justify-content-around">
                        <Link to={`/userprofile/${this.state.loggedUser._id}`}>UPDATE PROFILE</Link>
                        <Button onClick={() => this.showAlert(true)}>DELETE PROFILE</Button>
                        <Button onClick={this.logoutUser}>LOG OUT</Button>
                    </Row>
                    <Row>
                        <Col>
                            <h4>My comments: </h4>
                            <BlogComments
                                comments={this.state.comments}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default UserProfile;
