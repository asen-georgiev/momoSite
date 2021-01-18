import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FormLabel} from "react-bootstrap";

function ContactsMailForm(props) {
    return (
        <div>
            <Form onSubmit={props.onSubmit}>
                <FormGroup>
                    <FormLabel>Full name</FormLabel>
                    <FormControl
                    id="fullname"
                    name="fullname"
                    value={props.fullname}
                    type="text"
                    placeholder="Please enter your full name"
                    onChange={props.onChange}/>
                    {props.errors.fullname &&
                    <p className="alert alert-danger">{props.errors.fullname}</p>}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                    id="email"
                    name="email"
                    value={props.email}
                    type="email"
                    placeholder="Please enter your email"
                    onChange={props.onChange}/>
                    {props.errors.email &&
                    <p className="alert alert-danger">{props.errors.email}</p>}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Subject</FormLabel>
                    <FormControl
                    id="subject"
                    name="subject"
                    value={props.subject}
                    type="text"
                    placeholder="Please enter the email subject"
                    onChange={props.onChange}/>
                    {props.errors.subject &&
                    <p className="alert alert-danger">{props.errors.subject}</p>}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Message</FormLabel>
                    <FormControl
                    id="message"
                    name="message"
                    value={props.message}
                    as="textarea"
                    placeholder="Please enter your message"
                    onChange={props.onChange}/>
                    {props.errors.message &&
                    <p className="alert alert-danger">{props.errors.message}</p>}
                </FormGroup>
                <Row className="m-0">
                    <Button
                    type="submit"
                    disabled={props.isDisabled}>SEND MESSAGE</Button>
                </Row>
                {props.Recaptcha}
            </Form>
        </div>
    );
}

export default ContactsMailForm;
