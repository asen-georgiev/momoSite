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
import {getCurrentUser, userLogin} from "../../services/userLoginService";
import {FormLabel} from "react-bootstrap";

class UserLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPassword: '',
            errors: {},
            isDisabled: false,
            loggedUser: ''
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
                    {this.state.loggedUser === null &&
                    <Row className="m-0">
                        <Col>
                            <Row>
                                <h4>User login:</h4>
                            </Row>
                            <Card>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Row>
                                            <Col>
                                                <FormLabel>User email</FormLabel>
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
                                            </Col>
                                            <Col>
                                                <FormLabel>User password</FormLabel>
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
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row className="py-2">
                                        <Col>
                                            <Row className="justify-content-end px-3">
                                                {this.state.isDisabled &&
                                                <Button href="/userprofile">
                                                    USER PANEL
                                                </Button>
                                                }
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row className="justify-content-end px-3">
                                                <Button
                                                    disabled={this.state.isDisabled}
                                                    type="submit">
                                                    SUBMIT
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>}
                    {this.state.loggedUser &&
                    <Row>
                        <h3>YOU ARE ALREADY LOGGED IN!</h3>
                    </Row>}
                </Container>
            </div>
        );
    }
}

export default UserLoginForm;
