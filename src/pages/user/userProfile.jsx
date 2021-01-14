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
import Card from "react-bootstrap/Card";
import {getCurrentUser, userLogout} from "../../services/userLoginService";
import jwtDecode from "jwt-decode";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedUser:[]
        }
    }

    componentDidMount() {
        const jwtUser = getCurrentUser();
        const loggedUser = jwtDecode(jwtUser);
        this.setState({loggedUser});
    }

    logoutUser=()=>{
        userLogout();
        this.props.history.push("/userlogin");
    }


    render() {
        return (
            <div>
                <h2>Logged as: {this.state.loggedUser.userName}</h2>
                <Button onClick={this.logoutUser}>
                    LOGOUT USER
                </Button>
            </div>
        );
    }
}

export default UserProfile;
