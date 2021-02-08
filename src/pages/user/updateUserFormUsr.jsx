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
                userPicture: ""
            },
            uploadPicture: null,
            showPicture: null,
            errors: {},
            isDisabled: true
        }
    }
    render() {
        return (
            <div>

            </div>
        );
    }
}

export default UpdateUserFormUsr;
