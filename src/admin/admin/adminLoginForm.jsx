import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Joi from "joi";
import {Slide, toast, Zoom} from "react-toastify";
import {adminLogin, getCurrentAdmin} from "../../services/adminLoginService";
import "../../css/admin/adminLogin.css"
import FormLabel from "react-bootstrap/FormLabel";


class AdminLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminEmail: '',
            adminPassword: '',
            errors: {},
            isDisabled: false,
            loggedAdmin: ''
        }
    };

    schema = Joi.object({
        adminEmail: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Admin email"),
        adminPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("Admin password")
    });


    componentDidMount() {
        const loggedAdmin = getCurrentAdmin();
        this.setState({loggedAdmin});
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validate();
        this.setState({errors: errors || {}});
        if (errors) return;

        console.log('Form submitted.');

        const admin = {adminEmail: this.state.adminEmail, adminPassword: this.state.adminPassword};
        await adminLogin(admin);

        toast('You are now logged in!', {
            position: "top-center",
            transition: Zoom,
            className: 'login-toaster'
        });
        this.setState({isDisabled: true});
    }

    validate = () => {
        const admin = {adminEmail: this.state.adminEmail, adminPassword: this.state.adminPassword};
        const options = {abortEarly: false};
        const result = this.schema.validate(admin, options);
        // console.log(result);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    };


    render() {
        return (
            <div>
                <Container className="login-main-container" fluid={true}>
                    <Container className="container-lg login-sub-container" fluid={true}>
                        {this.state.loggedAdmin === null &&
                        <Row>
                            <Col>
                                <div className="login-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                            <FormGroup className="px-5 pt-5">
                                            <Row>
                                                <Col>
                                                    {this.state.errors.adminEmail &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.adminEmail}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="login-form-control"
                                                        autoFocus={true}
                                                        id="adminEmail"
                                                        name="adminEmail"
                                                        type="email"
                                                        placeholder="admin email"
                                                        value={this.state.adminEmail}
                                                        onChange={this.handleChange}/>
                                                </Col>
                                                <Col>
                                                    {this.state.errors.adminPassword &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.adminPassword}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="login-form-control"
                                                        id="adminPassword"
                                                        name="adminPassword"
                                                        type="password"
                                                        placeholder="admin password"
                                                        value={this.state.adminPassword}
                                                        onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <Row className="px-5 pb-5 py-3">
                                            <Col>
                                                <Row className="justify-content-start px-3">
                                                    {this.state.isDisabled &&
                                                    <Button
                                                        className="admin-redirect-button"
                                                        href="/admin">
                                                        TO ADMIN PANEL
                                                    </Button>
                                                    }
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row className="justify-content-end px-3">
                                                    <Button
                                                        className="admin-login-button"
                                                        disabled={this.state.isDisabled}
                                                        type="submit">
                                                        LOGIN
                                                    </Button>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                        }
                        {this.state.loggedAdmin &&
                        <Row className="align-content-center" style={{height: '40rem'}}>
                            <Col>
                                <h2 className="text-center" style={{color: 'wheat'}}>YOU ARE ALREADY LOGGED IN!</h2>
                            </Col>
                        </Row>}
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AdminLoginForm;
