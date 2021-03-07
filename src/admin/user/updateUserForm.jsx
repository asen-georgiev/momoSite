import React, {Component} from 'react';
import Joi from "joi";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {toast, Zoom} from "react-toastify";
import {FormLabel, Image} from "react-bootstrap";
import {picUrl} from "../../config.json";
import {getUserAdmin, updateUserAdmin} from "../../services/userService";
import {uploadImageAdmin} from "../../services/imgService";
import "../../css/admin/user/userUpdate.css"
import CardImg from "react-bootstrap/CardImg";

class UpdateUserForm extends Component {
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
                userPicture: ""
            },
            uploadPicture: null,
            showPicture: null,
            errors: {},
            isDisabled: true
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
            .label("Personal telephone")
        // .pattern(new RegExp('[0-9]'))
    })


    async componentDidMount() {
        const url = picUrl;
        await this.populateUser();
        this.setState({url: url})
        console.log(this.state);
    }


    populateUser = async () => {
        try {
            const userId = this.props.match.params.id;
            const {data: user} = await getUserAdmin(userId);
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
            uploadPicture: event.target.files[0]
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
            isDisabled: false
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateUser();
        this.setState({errors: errors || {}});
        if (errors) return;

        if (this.state.uploadPicture !== null) {
            const data = new FormData();
            data.append('file', this.state.uploadPicture);
            await uploadImageAdmin(data);
            toast("New image successfully uploaded!", {
                position: "top-center",
                transition: Zoom,
                className: 'update-user-toaster'
            });
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
        await updateUserAdmin(user, this.state.user._id);
        this.setState({isDisabled: true});
        toast("User was successfully updated!", {
            position: "top-center",
            transition: Zoom,
            className: 'update-user-toaster'
        });


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
            userPicture: this.state.user.userPicture
        };

        const options = {abortEarly: false};
        const result = this.schema.validate(user, options);

        if (!result.error) return null;

        const errors = {}
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    adminRedirect = () => {
        this.props.history.push("/admin/userslist")
    }

    render() {
        return (
            <div>
                <Container className="update-user-main-container" fluid={true}>
                    <Container className="update-user-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="update-user-span">Update user :</span>
                        </Row>
                        <Row>
                            <Col>
                                <div className="update-user-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md="auto" className="pr-0">
                                                {this.state.showPicture === null &&
                                                <CardImg
                                                    className="ml-5 mt-5"
                                                    src={this.state.url + this.state.user.userPicture}
                                                    style={{width: 300, height: 365}}/>
                                                }
                                                {this.state.showPicture &&
                                                <CardImg
                                                    className="ml-5 mt-5"
                                                    src={this.state.showPicture}
                                                    style={{width: 300, height: 365}}/>
                                                }
                                                <FormGroup className="px-5 pt-4">
                                                    <Form.File
                                                        className="update-user-form"
                                                        id="image"
                                                        name="userPicture"
                                                        label={this.state.errors.userPicture || "Change the profile picture"}
                                                        onChange={this.handleImage}/>
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-0">
                                                <FormGroup className="px-5 pt-5">
                                                    {this.state.errors.userName &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userName}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        autoFocus={true}
                                                        name="userName"
                                                        type="text"
                                                        value={this.state.user.userName}
                                                        placeholder="Enter user's first name"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    {this.state.errors.userFamily &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userFamily}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        name="userFamily"
                                                        type="text"
                                                        value={this.state.user.userFamily}
                                                        placeholder="Enter user's second name"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    {this.state.errors.userAddress &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userAddress}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        name="userAddress"
                                                        type="text"
                                                        value={this.state.user.userAddress}
                                                        placeholder="Enter user's address: country / city / street / postal code"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    {this.state.errors.userEmail &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userEmail}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        name="userEmail"
                                                        type="email"
                                                        value={this.state.user.userEmail}
                                                        placeholder="Enter user's e-mail address"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    {this.state.errors.userTelephone &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userTelephone}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        name="userTelephone"
                                                        type="text"
                                                        value={this.state.user.userTelephone}
                                                        placeholder="Enter user's telephone"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup className="px-5 pt-2">
                                                    {this.state.errors.userPassword &&
                                                    <FormLabel className="text-danger">
                                                        {this.state.errors.userPassword}
                                                    </FormLabel>}
                                                    <FormControl
                                                        className="update-user-form-control"
                                                        name="userPassword"
                                                        type="password"
                                                        value={this.state.user.userPassword}
                                                        placeholder="Enter user's password : min. 8 symbols"
                                                        onChange={this.handleChange}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="px-5 pb-4 py-3 d-flex justify-content-between">
                                            <Col md={4}>
                                                <Button
                                                    className="update-user-register-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    UPDATE USER
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="update-user-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO USERS LIST
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

export default UpdateUserForm;
