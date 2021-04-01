import React, {Component} from 'react';
import '../../css/user/userRegister.css';
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
import {CardImg, FormLabel} from "react-bootstrap";
import {uploadImageUser} from "../../services/imgService";
import {registerUser} from "../../services/userService";
import profile from '../../assets/profile-default.png'

class RegisterUserFormUsr extends Component {
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
            uploadPicture: '',
            isRegistered: false
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
            .max(100)
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
    })


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateUserRegister();
        this.setState({errors: errors || {}});
        console.log(errors);
        if (errors) return;

        if (this.state.uploadPicture === '') {
            toast.error('You must select profile picture to upload!');
            return;
        }

        const user = {
            userName: this.state.userName,
            userFamily: this.state.userFamily,
            userPassword: this.state.userPassword,
            userEmail: this.state.userEmail,
            userPicture: this.state.userPicture,
            userAddress: this.state.userAddress,
            userTelephone: this.state.userTelephone
        };

        await registerUser(user);
        toast('Successful registration!', {
            position: "top-center",
            transition: Zoom,
            className: 'user-register-toaster'
        });

        const data = new FormData();
        data.append('file', this.state.uploadPicture);
        await uploadImageUser(data);
        toast('Image was successfully uploaded!', {
            position: "top-center",
            transition: Zoom,
            className: 'user-register-toaster'
        });
        console.log('User profile image was uploaded to gallery');

        this.setState({isDisabled: true, isRegistered: true});

    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isDisabled: false
        })
    }

    onImageHandler = (event) => {
        this.setState({
            showPicture: URL.createObjectURL(event.target.files[0]),
            uploadPicture: event.target.files[0],
            userPicture: event.target.files[0].name,
            isDisabled: false
        });
    }

    validateUserRegister = () => {
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


    render() {
        return (
            <div>
                <Container className="user-register-main" fluid={true}>
                    <Row className="user-register-row-main d-flex justify-content-center">
                        {this.state.isRegistered === false &&
                        <Col>
                            <Card className="user-register-card">
                                <Form onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="auto" className="pr-0">
                                            {this.state.showPicture &&
                                            <CardImg
                                                className="ml-5 mt-5"
                                                src={this.state.showPicture}
                                                style={{width: 330, height: 365}}/>
                                            }
                                            {!this.state.showPicture &&
                                            <CardImg
                                                className="ml-5 mt-5"
                                                src={profile}
                                                style={{width: 330, height: 365}}/>
                                            }
                                            <FormGroup className="pl-5 pt-4">
                                                <Form.File
                                                    className="user-register-form"
                                                    id="image"
                                                    name="image"
                                                    label={this.state.errors.userPicture && "You must select image for profile picture"
                                                    || "Select image for profile picture"}
                                                    onChange={this.onImageHandler}/>
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-0">
                                            <FormGroup className="px-5 pt-5">
                                                {this.state.errors.userName &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userName}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    autoFocus={true}
                                                    name="userName"
                                                    type="text"
                                                    value={this.state.userName}
                                                    placeholder="Please enter your first name"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userFamily &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userFamily}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    name="userFamily"
                                                    type="text"
                                                    value={this.state.userFamily}
                                                    placeholder="Please enter your second name"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userAddress &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userAddress}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    name="userAddress"
                                                    type="text"
                                                    value={this.state.userAddress}
                                                    placeholder="Please enter your address : country / city / street / postal code"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userEmail &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userEmail}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    name="userEmail"
                                                    type="email"
                                                    value={this.state.userEmail}
                                                    placeholder="Please enter your e-mail"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userTelephone &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userTelephone}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    name="userTelephone"
                                                    type="text"
                                                    value={this.state.userTelephone}
                                                    placeholder="Please enter your personal telephone"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userPassword &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userPassword}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-register-form-control"
                                                    name="userPassword"
                                                    type="password"
                                                    value={this.state.userPassword}
                                                    placeholder="Please enter your password : min. 8 symbols"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                        <Col md={4}>
                                            <Button
                                                className="user-register-register-button"
                                                type="submit"
                                                disabled={this.state.isDisabled}>
                                                REGISTER
                                            </Button>
                                        </Col>
                                        <Col className="d-flex justify-content-end">
                                            <Button
                                                className="user-register-redirect-button"
                                                href="/userlogin">
                                                BACK TO LOGIN PAGE
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        }

                        {this.state.isRegistered &&
                        <Card className="user-register-card2">
                            <Card.Title
                                className="user-register-welcome text-center">
                                WELCOME!
                            </Card.Title>
                            <Card.Subtitle
                                className="user-register-names text-center">
                                ASEN GEORGIEV
                            </Card.Subtitle>
                            <CardImg
                                src={this.state.showPicture}
                                style={{width: 330, height: 365}}/>
                            <Card.Body className="d-flex justify-content-center">
                                <Button
                                    className="user-register-profile-button"
                                    href="/userprofile">
                                    GO TO YOUR PROFILE
                                </Button>
                            </Card.Body>
                        </Card>
                        }

                    </Row>
                </Container>
            </div>
        );
    }
}

export default RegisterUserFormUsr;
