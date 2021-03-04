import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import {toast, Zoom} from "react-toastify";
import {FormLabel} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import "../../css/admin/adminRegister.css";
import {registerAdmin} from "../../services/adminService";

class RegisterAdminForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: "",
            adminEmail: "",
            adminPassword: "",
            isAdmin: false,
            errors: {},
            isDisabled: true
        }
    };

    schema = Joi.object({
        adminName: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Admin name"),
        adminEmail: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Admin email"),
        adminPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("Admin password"),
        isAdmin: Joi.boolean()
            .label("Is Admin")
    });


    handleChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            isDisabled: false
        });
    }


    validateAdminInput = () => {
        const admin = {
            adminName: this.state.adminName,
            adminEmail: this.state.adminEmail,
            adminPassword: this.state.adminPassword,
            isAdmin: this.state.isAdmin
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(admin, options);
        console.log(result);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateAdminInput();
        this.setState({errors: errors || {}});
        if (errors) return;
        this.setState({isDisabled: true});

        const admin = {
            adminName: this.state.adminName,
            adminEmail: this.state.adminEmail,
            adminPassword: this.state.adminPassword,
            isAdmin: this.state.isAdmin
        };

        await registerAdmin(admin);
        toast('Admin registration was successful!',{
            position: "top-center",
            transition: Zoom,
            className: 'register-toaster'
        });

    }


    adminRedirect = () => {
        this.props.history.push("/admin")
    }

    render() {
        return (
            <div>
                <Container className="register-main-container" fluid={true}>
                    <Container className="container-lg register-sub-container">
                        <Row>
                            <Col>
                                <div className="register-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup className="px-5 pt-4">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Name*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="register-form-control"
                                                autoFocus={true}
                                                id="adminName"
                                                name="adminName"
                                                type="text"
                                                value={this.state.adminName}
                                                placeholder={this.state.errors.adminName || "Enter Admin's name"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Email*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="register-form-control"
                                                id="adminEmail"
                                                name="adminEmail"
                                                type="email"
                                                value={this.state.adminEmail}
                                                placeholder={this.state.errors.adminEmail || "Enter Admin's email"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Password*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="register-form-control"
                                                id="adminPassword"
                                                name="adminPassword"
                                                type="password"
                                                value={this.state.adminPassword}
                                                placeholder={this.state.errors.adminPassword || "Enter Admin's password"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            <FormCheck
                                                className="register-checkbox"
                                                id="isAdmin"
                                                name="isAdmin"
                                                type="checkbox"
                                                value={this.state.isAdmin}
                                                label="User will have Admin rights"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-5 py-2 d-flex justify-content-between">
                                            <Col>
                                                <Button
                                                    className="register-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    REGISTER ADMIN
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="register-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO ADMIN PANEL
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default RegisterAdminForm;
