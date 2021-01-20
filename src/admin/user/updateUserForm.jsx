import React, {Component} from 'react';
import Joi from "joi";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import {FormLabel, Image} from "react-bootstrap";
import {picUrl} from "../../config.json";
import {getUser, updateUserAdmin} from "../../services/userService";
import {uploadImageAdmin} from "../../services/imgService";

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
            .label("Personal telephone"),
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
            const {data: user} = await getUser(userId);
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
            toast.success("New profile picture successfully uploaded!");
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
        toast.success("The user was successfully updated!");


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
                <Container>
                    <Row>
                        <Col>
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="justify-content-center">
                                    {this.state.showPicture === null &&
                                    <div>
                                        <h5>Current profile picture :</h5>
                                        <Image src={this.state.url + this.state.user.userPicture}
                                               width="300"
                                               height="auto"/>
                                    </div>}
                                    {this.state.showPicture &&
                                    <Col>
                                        <h5>Updated prrofile picture :</h5>
                                        <Image src={this.state.showPicture}
                                               width="300"
                                               height="auto"/>
                                    </Col>}
                                        <FormGroup className="align-self-center ml-5">
                                            <FormLabel htmlFor="image">
                                                Upload :
                                            </FormLabel>
                                            <Form.File
                                                id="image"
                                                name="userPicture"
                                                label="Change user profile picture"
                                                onChange={this.handleImage}/>
                                            {this.state.errors.userPicture &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userPicture}
                                            </p>}
                                        </FormGroup>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>
                                                First name :
                                            </FormLabel>
                                            <FormControl
                                                autoFocus={true}
                                                name="userName"
                                                type="text"
                                                value={this.state.user.userName}
                                                placeholder="Enter user's firs name"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userName &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userName}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>
                                                Second name :
                                            </FormLabel>
                                            <FormControl
                                                name="userFamily"
                                                type="text"
                                                value={this.state.user.userFamily}
                                                placeholder="Enter user's second name"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userFamily &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userFamily}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <FormLabel>
                                        Address :
                                    </FormLabel>
                                    <FormControl
                                        name="userAddress"
                                        type="text"
                                        value={this.state.user.userAddress}
                                        placeholder="Enter user's address: country / city / street / postal code"
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userAddress &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userAddress}
                                    </p>}
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>
                                                E-mail :
                                            </FormLabel>
                                            <FormControl
                                                name="userEmail"
                                                type="email"
                                                value={this.state.user.userEmail}
                                                placeholder="Enter user's e-mail address"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userEmail &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userEmail}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <FormLabel>
                                                Telephone :
                                            </FormLabel>
                                            <FormControl
                                                name="userTelephone"
                                                type="text"
                                                value={this.state.user.userTelephone}
                                                placeholder="Enter user's telephone"
                                                onChange={this.handleChange}/>
                                            {this.state.errors.userTelephone &&
                                            <p className="text-danger pt-2">
                                                {this.state.errors.userTelephone}
                                            </p>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <FormLabel>
                                        Password :
                                    </FormLabel>
                                    <FormControl
                                        name="userPassword"
                                        type="password"
                                        value={this.state.user.userPassword}
                                        placeholder="Enter user's password : min, 8 symbols"
                                        onChange={this.handleChange}/>
                                    {this.state.errors.userPassword &&
                                    <p className="text-danger pt-2">
                                        {this.state.errors.userPassword}
                                    </p>}
                                </FormGroup>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Button
                                            type="submit"
                                            disabled={this.state.isDisabled}>
                                            SUBMIT
                                        </Button>
                                    </Col>
                                    <Col md={{span: 4, offset: 4}} className="d-flex flex-row-reverse">
                                        <Button
                                            onClick={this.adminRedirect}>
                                            BACK TO USERS LIST
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default UpdateUserForm;