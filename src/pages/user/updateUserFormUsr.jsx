import React, {Component} from 'react';
import Joi from "joi";
import _ from 'lodash';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {toast, Zoom} from "react-toastify";
import {FormLabel, Image} from "react-bootstrap";
import {picUrl} from "../../config.json";
import {getUserUser, updateUser} from "../../services/userService";
import {uploadImageUser} from "../../services/imgService";
import {userLogout} from "../../services/userLoginService";
import "../../css/user/userUpdate.css";
import CardImg from "react-bootstrap/CardImg";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class UpdateUserFormUsr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                userName: "",
                userFamily: "",
                userEmail: "",
                userPassword: "",
                userAddress: "",
                userTelephone: "",
                userPicture: "",
                repeatedPassword: ''
            },
            uploadPicture: null,
            showPicture: null,
            errors: {},
            isDisabled: true,
            isUpdated: true
        }
    }

    schema = Joi.object({
        _id: Joi.string(),
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
            .label("Personal telephone"),
        repeatedPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .trim(true)
            .label("Repeated password"),
    })


    async componentDidMount() {
        const url = pictureUrl;
        await this.populateUser();
        this.setState({url: url});
        console.log(this.state);
    }


    populateUser = async () => {
        try {
            const userId = this.props.match.params.id;
            const {data: user} = await getUserUser(userId);
            this.setState({user: this.mapToViewModel(user)});
        } catch (e) {
            if (e.response && e.response.status === 404)
                console.log("There is no user with the given ID!");
        }
    }


    handleImage = (event) => {
        const user = {...this.state.user};
        const target = event.target;
        const value = event.target.files[0].name;
        const name = target.name;
        user[name] = value;
        this.setState({
            user,
            showPicture: URL.createObjectURL(event.target.files[0]),
            uploadPicture: event.target.files[0],
            isDisabled: false,
            isUpdated: false
        });
    }


    handleChange = (event) => {
        const user = {...this.state.user};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        user[name] = value;
        this.setState({
            user,
            isDisabled: false,
            isUpdated: false
        });
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateUser();
        this.setState({
            errors: errors || {}
        });
        if (errors) return;

        const result = _.isEqual(this.state.user.userPassword, this.state.user.repeatedPassword);
        if (result !== true) {
            toast("Your passwords did not match!", {
                position: "top-center",
                transition: Zoom,
                className: 'user-update-toaster-error'
            });
            return;
        }

        if (this.state.uploadPicture !== null) {
            const data = new FormData();
            data.append('file', this.state.uploadPicture);
            await uploadImageUser(data);
        }

        const user = {
            userName: this.state.user.userName,
            userFamily: this.state.user.userFamily,
            userEmail: this.state.user.userEmail,
            userAddress: this.state.user.userAddress,
            userTelephone: this.state.user.userTelephone,
            userPassword: this.state.user.userPassword,
            userPicture: this.state.user.userPicture
        };
        await updateUser(user, this.state.user._id);
        this.setState({isUpdated: true});
        toast("Your profile was successfully updated!", {
            position: "top-center",
            transition: Zoom,
            className: 'user-update-toaster'
        });
        userLogout();
        setTimeout(function (){window.location.href = "/userlogin";},1500);
    }


    mapToViewModel = (user) => {
        return {
            _id: user._id,
            userName: user.userName,
            userFamily: user.userFamily,
            userEmail: user.userEmail,
            userAddress: user.userAddress,
            userTelephone: user.userTelephone,
            userPicture: user.userPicture
        };
    }


    validateUser = () => {
        const user = {
            userName: this.state.user.userName,
            userFamily: this.state.user.userFamily,
            userEmail: this.state.user.userEmail,
            userAddress: this.state.user.userAddress,
            userTelephone: this.state.user.userTelephone,
            userPassword: this.state.user.userPassword,
            userPicture: this.state.user.userPicture,
            repeatedPassword: this.state.user.repeatedPassword
        };

        const options = {abortEarly: false};
        const result = this.schema.validate(user, options);

        if (!result.error) return null;

        const errors = {}
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    userRedirect = () => {
        this.props.history.push("/userprofile");
    }

    // logoutUser = () => {
    //     userLogout();
    //     // this.props.history.push("/userlogin");
    // }

    render() {
        return (
            <div>
                <Container className="user-update-main" fluid={true}>
                    <Row className="user-update-row-main d-flex justify-content-center">
                        <Col>
                            <Card className="user-update-card">
                                <Form onSubmit={this.handleSubmit}>
                                    <Row>

                                        <Col md="auto" className="pr-0">
                                            {this.state.showPicture === null &&
                                            <CardImg
                                                className="ml-5 mt-5"
                                                src={this.state.url + this.state.user.userPicture}
                                                style={{width: 330, height: 'auto'}}/>
                                            }
                                            {this.state.showPicture &&
                                            <CardImg
                                                className="ml-5 mt-5"
                                                src={this.state.showPicture}
                                                style={{width: 330, height: 'auto'}}/>
                                            }
                                            <FormGroup
                                                className="pl-5 pt-4">
                                                <Form.File
                                                    className="user-register-form"
                                                    id="image"
                                                    name="userPicture"
                                                    label="You can change your profile picture"
                                                    onChange={this.handleImage}/>
                                                {this.state.errors.userPicture &&
                                                <p className="text-danger pt-2">
                                                    {this.state.errors.userPicture}
                                                </p>}
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-0">
                                            <FormGroup className="px-5 pt-5">
                                                {this.state.errors.userName &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userName}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    autoFocus={true}
                                                    name="userName"
                                                    type="text"
                                                    value={this.state.user.userName}
                                                    placeholder="Please enter your first name"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userFamily &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userFamily}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="userFamily"
                                                    type="text"
                                                    value={this.state.user.userFamily}
                                                    placeholder="Please enter your second name"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userAddress &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userAddress}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="userAddress"
                                                    type="text"
                                                    value={this.state.user.userAddress}
                                                    placeholder="Please enter your address: country / city / street / postal code"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userEmail &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userEmail}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="userEmail"
                                                    type="email"
                                                    value={this.state.user.userEmail}
                                                    placeholder="Please enter your e-mail address"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userTelephone &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userTelephone}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="userTelephone"
                                                    type="text"
                                                    value={this.state.user.userTelephone}
                                                    placeholder="Please enter your telephone number"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.userPassword &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.userPassword}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="userPassword"
                                                    type="password"
                                                    value={this.state.user.userPassword}
                                                    placeholder="Please enter your password: min. 8 symbols"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>

                                            <FormGroup className="px-5 pt-2">
                                                {this.state.errors.repeatedPassword &&
                                                <FormLabel className="text-danger">
                                                    {this.state.errors.repeatedPassword}
                                                </FormLabel>}
                                                <FormControl
                                                    className="user-update-form-control"
                                                    name="repeatedPassword"
                                                    type="password"
                                                    value={this.state.repeatedPassword}
                                                    placeholder="Please confirm your password: min. 8 symbols"
                                                    onChange={this.handleChange}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row className="px-5 py-4 ">
                                        <Col>
                                            <Button
                                                className="user-update-button"
                                                type="submit"
                                                disabled={this.state.isUpdated}>
                                                UPDATE PROFILE
                                            </Button>
                                        </Col>
                                        <Col className="row text-center">
                                            <span className="user-update-span">
                                            *After UPDATE you will be redirected to LOGIN page!
                                        </span>
                                        </Col>
                                        <Col className="d-flex justify-content-end">
                                            <Button
                                                disabled={!this.state.isDisabled}
                                                className="user-update-redirect-button"
                                                onClick={this.userRedirect}>
                                                BACK TO PROFILE
                                            </Button>
                                            {/*{!this.state.isDisabled &&*/}
                                            {/*<Button*/}
                                            {/*    className="user-update-redirect-button"*/}
                                            {/*    href="/userlogin">*/}
                                            {/*    TO USER LOGIN*/}
                                            {/*</Button>*/}
                                            {/*}*/}
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default UpdateUserFormUsr;
