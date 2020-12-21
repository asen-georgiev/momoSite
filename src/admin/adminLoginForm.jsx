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
import {adminLogin, getCurrentAdmin} from "../services/adminLoginService";
import jwtDecode from "jwt-decode";


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
            .label("AdminEmail"),
        adminPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("AdminPassword")
    });


    async componentDidMount() {
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

        toast.success('Admin logged successfully!');
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
                <Container className="container" fluid={true}>
                    {this.state.loggedAdmin === null &&
                    <Row className="m-0">
                        <Col>
                            <Row className="bg-light">
                                <h4>Login for the Admin panel:</h4>
                            </Row>
                            <Card className="bg-dark">
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup className="py-5">
                                        <Row>
                                            <Col>
                                                <FormControl
                                                    autoFocus={true}
                                                    id="adminEmail"
                                                    name="adminEmail"
                                                    type="email"
                                                    placeholder={"Admin email"}
                                                    value={this.state.adminEmail}
                                                    onChange={this.handleChange}/>
                                                {this.state.errors.adminEmail &&
                                                <p className="text-danger pt-2">
                                                    {this.state.errors.adminEmail}
                                                </p>}
                                            </Col>
                                            <Col>
                                                <FormControl
                                                    id="adminPassword"
                                                    name="adminPassword"
                                                    type="password"
                                                    placeholder={"Admin password"}
                                                    value={this.state.adminPassword}
                                                    onChange={this.handleChange}/>
                                                {this.state.errors.adminPassword &&
                                                <p className="text-danger pt-2">
                                                    {this.state.errors.adminPassword}
                                                </p>}
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row className="py-2">
                                        <Col>
                                            <Row className="justify-content-end px-3">
                                                {this.state.isDisabled &&
                                                <Button href="/admin">
                                                    ADMIN PANEL
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
                    </Row>
                    }
                    {this.state.loggedAdmin &&
                    <Row>
                        <h3>YOU ARE ALREADY LOGGED IN AS: </h3>
                    </Row>}
                </Container>
            </div>
        );
    }
}

export default AdminLoginForm;
