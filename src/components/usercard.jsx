import React from 'react';
import Card from "react-bootstrap/Card";
import {CardImg} from "react-bootstrap";
import "../css/user/userProfile.css";

function Usercard(props) {
    return (
        <React.Fragment>
            <Card className="d-flex flex-row user-profile-card mx-4 my-5">
                    <CardImg
                        src={props.src}
                        style={{width:'25vw',height:'auto'}}/>
                <Card.Body className="text-center ml-4">
                    <Card.Subtitle className="user-profile-card-subtitle">
                        name :
                    </Card.Subtitle>
                    <Card.Title className="user-profile-card-title">
                        {props.loggedUser.userName} {props.loggedUser.userFamily}
                    </Card.Title>
                    <Card.Subtitle className="user-profile-card-subtitle">
                        e-mail :
                    </Card.Subtitle>
                    <Card.Title className="user-profile-card-title">
                        {props.loggedUser.userEmail}
                    </Card.Title>
                    <Card.Subtitle className="user-profile-card-subtitle">
                        address :
                    </Card.Subtitle>
                    <Card.Title className="user-profile-card-title">
                        {props.loggedUser.userAddress}
                    </Card.Title>
                    <Card.Subtitle className="user-profile-card-subtitle">
                        telephone :
                    </Card.Subtitle>
                    <Card.Title className="user-profile-card-title">
                        {props.loggedUser.userTelephone}
                    </Card.Title>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default Usercard;
