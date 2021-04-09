import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import "../css/user/userProfile.css";
import Row from "react-bootstrap/Row";


function UserDeleteAlert(props) {

    return (
        <React.Fragment>
            <Alert
                style={{width: '50vw'}}
                show={props.showAlert}
                variant={props.variant}
                className="text-center user-profile-alert">
                <Alert.Heading>
                    {props.heading}
                </Alert.Heading>
                <hr/>
                <Row className="justify-content-around">
                    <Button
                        className="user-profile-alert-yes"
                        onClick={props.onYes}
                        // variant={props.buttonYesVariant}
                    >
                        {props.buttonYes}
                    </Button>
                    <Button
                        className="user-profile-alert-no"
                        onClick={props.onNo}
                        // variant={props.buttonNoVariant}
                    >
                        {props.buttonNo}
                    </Button>
                </Row>
            </Alert>
        </React.Fragment>
    );
}

export default UserDeleteAlert;
