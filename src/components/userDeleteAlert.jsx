import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import {Fade} from "react-bootstrap";
import {Transition} from "react-transition-group";
import Row from "react-bootstrap/Row";


function UserDeleteAlert(props) {

    return (
        <React.Fragment>
            <Alert style={{width:'40rem'}} show={props.showAlert} variant={props.variant} className="text-center">
                <Alert.Heading>{props.heading}</Alert.Heading>
                <Row className="justify-content-around">
                <Button onClick={props.onYes} variant={props.buttonYesVariant}>{props.buttonYes}</Button>
                <Button onClick={props.onNo} variant={props.buttonNoVariant}>{props.buttonNo}</Button>
                </Row>
            </Alert>
        </React.Fragment>
    );
}

export default UserDeleteAlert;
