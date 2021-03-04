import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Joi from "joi";
import {toast, Zoom} from "react-toastify";
import Card from "react-bootstrap/Card";
import "../../css/admin/user/userRegister.css"
import {CardImg, FormLabel} from "react-bootstrap";
import {uploadImageAdmin} from "../../services/imgService";
import {registerUserAdmin} from "../../services/userService";
import vvitch from '../../assets/vvitch.jpg'

class RegisterUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userFamily: '',
            userPassword: '',
            userPicture: '',
            userEmail: '',
            userAddress: '',
            userTelephone: '',
            errors: {},
            isDisabled: true,
            showPicture: '',
            uploadPicture: ''
        }
    }

    schema = Joi.object({
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
            .max(50)
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
            .pattern(new RegExp('[0-9]'))
    })


    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            isDisabled: false
        });
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateUserInput();
        this.setState({errors: errors || {}});
        console.log(errors);
        if (errors) return;

        this.setState({isDisabled: true});

        const user = {
            userName: this.state.userName,
            userFamily: this.state.userFamily,
            userPassword: this.state.userPassword,
            userEmail: this.state.userEmail,
            userPicture: this.state.userPicture,
            userAddress: this.state.userAddress,
            userTelephone: this.state.userTelephone
        };

        await registerUserAdmin(user);
        toast('User was successfully registered!', {
            position: "top-center",
            transition: Zoom,
            className: 'register-user-toaster'
        });

        const data = new FormData();
        data.append('file', this.state.uploadPicture);
        await uploadImageAdmin(data);
        toast('Image was successfully uploaded!', {
            position: "top-center",
            transition: Zoom,
            className: 'register-user-toaster'
        });
        console.log('User profile image was uploaded to gallery');
    }


    validateUserInput = () => {
        const user = {
            userName: this.state.userName,
            userFamily: this.state.userFamily,
            userPassword: this.state.userPassword,
            userEmail: this.state.userEmail,
            userPicture: this.state.userPicture,
            userAddress: this.state.userAddress,
            userTelephone: this.state.userTelephone
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(user, options);

        if (!result.error) return null;

        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    onImageHandler = (event) => {
        this.setState({
            showPicture: URL.createObjectURL(event.target.files[0]),
            uploadPicture: event.target.files[0],
            userPicture: event.target.files[0].name,
            isDisabled: false
        })
    }


    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {
        return (
            <div>
                <Container className="register-user-main-container" fluid={true}>
                    <Container className="register-user-sub-container container-lg" fluid={true}>
                        <Row className="align-content-center bg-dark">
                            <Col>
                                <div className="register-user-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md="auto">
                                                {this.state.showPicture &&
                                                <CardImg
                                                    className="ml-5 mt-5"
                                                    src={this.state.showPicture}
                                                    style={{width: 300, height: 365}}/>
                                                }
                                                {!this.state.showPicture &&
                                                <CardImg
                                                    className="ml-5 mt-5"
                                                    src={vvitch}
                                                    style={{width: 300, height: 365}}/>
                                                }
                                                <FormGroup className="px-5 pt-4">
                                                    {/*<FormLabel htmlFor="image">*/}
                                                    {/*    Upload user profile image :*/}
                                                    {/*</FormLabel>*/}
                                                    <Form.File
                                                        className="register-user-form"
                                                        id="image"
                                                        name="image"
                                                        label={this.state.errors.userPicture || "Select profile image"}
                                                        onChange={this.onImageHandler}/>
                                                    {/*{this.state.errors.userPicture &&*/}
                                                    {/*<p className="text-danger pt-2">*/}
                                                    {/*    {this.state.errors.userPicture}*/}
                                                    {/*</p>}*/}
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup className="px-5 pt-5">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        autoFocus={true}
                                                        name="userName"
                                                        type="text"
                                                        value={this.state.userName}
                                                        placeholder={this.state.errors.userName || "Enter user's first name"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        name="userFamily"
                                                        type="text"
                                                        value={this.state.userFamily}
                                                        placeholder={this.state.errors.userFamily || "Enter user's second name"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        name="userAddress"
                                                        type="text"
                                                        value={this.state.userAddress}
                                                        placeholder={this.state.errors.userAddress || "Enter user's address: country / city / street / postal code"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        name="userEmail"
                                                        type="email"
                                                        value={this.state.userEmail}
                                                        placeholder={this.state.errors.userEmail || "Enter user's e-mail address"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        name="userTelephone"
                                                        type="text"
                                                        value={this.state.userTelephone}
                                                        placeholder={this.state.errors.userTelephone || "Enter user's telephone number"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    <FormControl
                                                        className="register-user-form-control"
                                                        name="userPassword"
                                                        type="password"
                                                        value={this.state.userPassword}
                                                        placeholder={this.state.errors.userPassword || "Enter user's password : min. 8 symbols"}
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="register-user-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    REGISTER
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="register-user-redirect-button"
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

export default RegisterUserForm;
