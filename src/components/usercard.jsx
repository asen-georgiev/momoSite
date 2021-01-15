import React from 'react';
import Card from "react-bootstrap/Card";
import {CardImg} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function Usercard(props) {
    return (
        <React.Fragment>
            <Card className={props.className}>
                <Card.Header>
                    <CardImg src={props.src} style={{width: props.imgWidth}}/>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{props.loggedUser.userName} {props.loggedUser.userFamily}</Card.Title>
                    <Card.Subtitle>e-mail : {props.loggedUser.userEmail}</Card.Subtitle>
                    <Card.Text>address : {props.loggedUser.userAddress}</Card.Text>
                    <Card.Subtitle>telephone : {props.loggedUser.userTelephone}</Card.Subtitle>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default Usercard;
