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
import {toast} from "react-toastify";
import Card from "react-bootstrap/Card";
import {getCurrentUser, userLogin} from "../../services/userLoginService";
import {FormLabel} from "react-bootstrap";
import {updateUserPassword} from "../../services/userService";

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
            .label("UserEmail"),
        userPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("UserPassword")
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

        toast.success('User logged successfully!');
        this.setState({isDisabled: true});

    }

    newPasswordSubmit = async (event) => {
        event.preventDefault();
        const userEmail = {userEmail: this.state.userEmail};
        await updateUserPassword(userEmail);
        this.setState({forgotPassword: false});
        toast.success(`Your new password was sent to ${this.state.userEmail}!`);
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


    render() {
        return (
            <div>
                <Container className="container" fluid={true}>
                    {!this.state.forgotPassword && this.state.loggedUser === null &&
                    <Row className="m-0 justify-content-center align-content-center" style={{height:'40rem'}}>
                        <Card style={{width: '30rem'}}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormLabel>User email :</FormLabel>
                                    <FormControl
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
                                    <FormLabel>User password :</FormLabel>
                                    <FormControl
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
                                <Row className="py-2">
                                    <Col className="d-flex flex-column mx-5">
                                        <Button
                                            className="m-3"
                                            disabled={this.state.isDisabled}
                                            type="submit">
                                            LOGIN
                                        </Button>
                                        {!this.state.forgotPassword && !this.state.isDisabled &&
                                        <Button
                                            className="m-3"
                                            onClick={this.handleForgot}>
                                            I forgot my password.
                                        </Button>
                                        }
                                        <Row className="justify-content-center">
                                        <span>Not registered : &nbsp;</span>
                                        <Link to={"/userregister"}>Create an account
                                        </Link>
                                        </Row>
                                        {this.state.isDisabled &&
                                        <Button
                                            className="m-3"
                                            href="/userprofile">
                                            USER PROFILE
                                        </Button>}
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Row>}
                    {this.state.loggedUser &&
                    <Row>
                        <h3>YOU ARE ALREADY LOGGED IN!</h3>
                    </Row>}
                    {this.state.forgotPassword &&
                    <Row className="m-5">
                        <Col className="p-5">
                            <Form onSubmit={this.newPasswordSubmit}>
                                <FormGroup>
                                    <FormLabel>
                                        Your email :
                                    </FormLabel>
                                    <FormControl
                                        autoFocus={true}
                                        id="userEmail"
                                        name="userEmail"
                                        type="email"
                                        placeholder="Please enter your registration email"
                                        onChange={this.handleChange}/>
                                </FormGroup>
                                <Button type="submit">
                                    Send me new password
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    }
                </Container>
            </div>
        );
    }
}

export default UserLoginForm;
