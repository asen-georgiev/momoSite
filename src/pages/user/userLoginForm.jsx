import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Joi from "joi";
import {Link} from "react-router-dom";
import {toast, Zoom} from "react-toastify";
import Card from "react-bootstrap/Card";
import {getCurrentUser, userLogin} from "../../services/userLoginService";
import {updateUserPassword} from "../../services/userService";
import "../../css/user/userLogin.css";

class UserLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPassword: '',
            errors: {},
            isDisabled: false,
            loggedUser: '',
            forgotPassword: false
        }
    };


    schema = Joi.object({
        userEmail: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("User email"),
        userPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("User password")
    });


    componentDidMount() {
        const loggedUser = getCurrentUser();
        this.setState({loggedUser});
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.value === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleForgot = () => {
        this.setState({forgotPassword: true});
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateUser();
        this.setState({errors: errors || {}});
        if (errors) return;
        console.log('User form submitted');

        const user = {userEmail: this.state.userEmail, userPassword: this.state.userPassword};
        await userLogin(user);

        toast('You are now logged in!', {
            position: "top-center",
            transition: Zoom,
            className: 'user-login-toaster'
        });
        this.setState({isDisabled: true});
        setTimeout(function () {
            window.location.href = "/userprofile";
        }, 1500);

    }

    newPasswordSubmit = async (event) => {
        event.preventDefault();
        const userEmail = {userEmail: this.state.userEmail};
        await updateUserPassword(userEmail);
        this.setState({forgotPassword: false});
        toast(`Your new password was sent to ${this.state.userEmail}!`, {
            position: "top-center",
            transition: Zoom,
            className: 'user-login-toaster'
        });
    }


    validateUser = () => {
        const user = {userEmail: this.state.userEmail, userPassword: this.state.userPassword};
        const options = {abortEarly: false};
        const result = this.schema.validate(user, options);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    loginRedirect = () => {
        this.setState({
            forgotPassword: false
        });
    }


    render() {
        return (
            <div>
                <Container className="user-login-main" fluid={true}>

                    {!this.state.forgotPassword && this.state.loggedUser === null &&
                    <Row className="user-login-row1 justify-content-center align-content-center"
                         style={{height: '50rem'}}>
                        <Card
                            className="user-login-card1 p-5"
                            style={{width: '40rem'}}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormControl
                                        className="user-login-form-control"
                                        autoFocus={true}
                                        id="userEmail"
                                        name="userEmail"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={this.state.userEmail}
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userEmail &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userEmail}
                                    </p>}
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        className="user-login-form-control"
                                        id="userPassword"
                                        name="userPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={this.state.userPassword}
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userPassword &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userPassword}
                                    </p>}
                                </FormGroup>

                                <Row className="py-3">
                                    <Col className=" d-flex flex-column mx-5">
                                        <Button
                                            className="user-login-button m-3"
                                            disabled={this.state.isDisabled}
                                            type="submit">
                                            LOGIN
                                        </Button>

                                        {!this.state.forgotPassword && !this.state.isDisabled &&
                                        <Button
                                            className="user-login-password-button m-3"
                                            onClick={this.handleForgot}>
                                            I FORGOT MY PASSWORD.
                                        </Button>
                                        }

                                        {!this.state.isDisabled &&
                                        <Row className="justify-content-center mt-2">
                                                <span className="user-login-register-span mb-1">
                                                    Not registered : &nbsp;
                                                </span>
                                            <Link
                                                className="user-login-account-link"
                                                to={"/userregister"}>
                                                CREATE AN ACCOUNT
                                            </Link>
                                        </Row>
                                        }

                                        {/*{this.state.isDisabled &&*/}
                                        {/*<Button*/}
                                        {/*    className="user-login-profile-button m-3"*/}
                                        {/*    href="/userprofile">*/}
                                        {/*    TO YOUR PROFILE*/}
                                        {/*</Button>}*/}

                                    </Col>
                                </Row>

                            </Form>
                        </Card>
                    </Row>}

                    {this.state.loggedUser &&
                    <Row className="justify-content-center align-content-center" style={{height: '46rem'}}>
                            <span className="user-login-already text-center">
                                YOU ARE ALREADY LOGGED IN!
                            </span>
                    </Row>}

                    {this.state.forgotPassword &&
                    <Row className="user-login-row2 justify-content-center align-content-center"
                         style={{height: '46rem'}}>
                        <Card
                            className="user-login-card2"
                            style={{width: '40rem'}}>
                            <Form onSubmit={this.newPasswordSubmit}>
                                <FormGroup>
                                    <FormControl
                                        className="user-login-form-control2"
                                        autoFocus={true}
                                        id="userEmail"
                                        name="userEmail"
                                        type="email"
                                        placeholder="Please enter your registration email"
                                        onChange={this.handleChange}/>
                                </FormGroup>
                                <Row>
                                    <Col className="d-flex flex-column">
                                        <Button
                                            className="user-login-button m-3 px-5"
                                            type="submit">
                                            SEND THE NEW PASSWORD
                                        </Button>
                                        <Button
                                            className="user-login-password-button m-3 px-5"
                                            onClick={this.loginRedirect}>
                                            BACK TO LOGIN FORM
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Row>
                    }

                </Container>
            </div>
        );
    }
}

export default UserLoginForm;
