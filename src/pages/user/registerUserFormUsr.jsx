import React, {Component} from 'react';
import '../../css/user/registerUserForm.css';
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
import {CardImg, FormLabel} from "react-bootstrap";
import {uploadImageUser} from "../../services/imgService";
import {registerUser} from "../../services/userService";

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


    handleSubmit = async(event) => {
        event.preventDefault();
        const errors = this.validateUserRegister();
        this.setState({errors: errors || {}});
        console.log(errors);
        if(errors) return;

        if(this.state.uploadPicture === '') {
            toast.error('You must select profile picture to upload!');
            return;
        }

        const data = new FormData();
        data.append('file', this.state.uploadPicture);
        await uploadImageUser(data);

        toast.success('The profile image was successfully uploaded!');
        console.log('User profile image was uploaded to gallery');

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
        this.setState({isDisabled: true, isRegistered:true});

}

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name] : value,
            isDisabled : false
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
        const result = this.schema.validate(user,options);

        if(!result.error) return null;

        const errors = {};
        for(let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    userRedirect = () => {
        this.props.history.push("/userprofile");
    }


    render() {
        return (
            <div>
                <Container className="container" fluid={true}>
                    <Row>
                        {this.state.isRegistered === false &&
                        <Col>
                            <Row><h2>Register new user : </h2></Row>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormLabel>
                                        Please upload picture for your profile.
                                    </FormLabel>
                                    <Form.File
                                        id="image"
                                        name="image"
                                        onChange={this.onImageHandler}/>
                                    {this.state.errors.userPicture &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userPicture}
                                    </p>}
                                </FormGroup>
                                <CardImg
                                    src={this.state.showPicture}
                                    style={{width: 300}}
                                />
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>First name :</FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="userName"
                                                type="text"
                                                value={this.state.userName}
                                                placeholder="Please enter your first name"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userName &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userName}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>Second name :</FormLabel>
                                            <FormControl
                                                name="userFamily"
                                                type="text"
                                                value={this.state.userFamily}
                                                placeholder="Please enter your second name"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userFamily &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userFamily}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <FormLabel>Address :</FormLabel>
                                    <FormControl
                                        name="userAddress"
                                        type="text"
                                        value={this.state.userAddress}
                                        placeholder="Please enter your address : country / city / street / postal code"
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userAddress &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userAddress}
                                    </p>}
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>E-mail :</FormLabel>
                                            <FormControl
                                                name="userEmail"
                                                type="email"
                                                value={this.state.userEmail}
                                                placeholder="Please enter your e-mail"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userEmail &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userEmail}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>Telephone: </FormLabel>
                                            <FormControl
                                                name="userTelephone"
                                                type="text"
                                                value={this.state.userTelephone}
                                                placeholder="Please enter your personal telephone"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userTelephone &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userTelephone}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl
                                        name="userPassword"
                                        type="password"
                                        value={this.state.userPassword}
                                        placeholder="Please enter your password : min. 8 symbols"
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userPassword &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userPassword}
                                    </p>}
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <Button
                                            type="submit"
                                            disabled={this.state.isDisabled}>
                                            REGISTER
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>}
                        {this.state.isRegistered &&
                        <Col>
                            <Row className="bg-info message-card">
                                <Card className="bg-secondary">
                                    <Card.Title>User was registered successfully!</Card.Title>
                                    <Card.Body className="message-card-body">
                                        <Button
                                            onClick={this.userRedirect}
                                        >GO TO YOUR PROFILE</Button>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Col>}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default RegisterUserFormUsr;
