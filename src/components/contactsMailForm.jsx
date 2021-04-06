import React from 'react';
import Row from "react-bootstrap/Row";
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
                    <FormControl
                        className="contacts-form-control"
                        id="fullname"
                        name="fullname"
                        value={props.fullname}
                        type="text"
                        placeholder="Please enter your full name"
                        onChange={props.onChange}/>
                    {props.errors.fullname &&
                    <FormLabel
                        className="contacts-form-label">
                        {props.errors.fullname}
                    </FormLabel>}
                </FormGroup>
                <FormGroup>
                    <FormControl
                        className="contacts-form-control"
                        id="email"
                        name="email"
                        value={props.email}
                        type="email"
                        placeholder="Please enter your email"
                        onChange={props.onChange}/>
                    {props.errors.email &&
                    <FormLabel
                        className="contacts-form-label">
                        {props.errors.email}
                    </FormLabel>}
                </FormGroup>
                <FormGroup>
                    <FormControl
                        className="contacts-form-control"
                        id="subject"
                        name="subject"
                        value={props.subject}
                        type="text"
                        placeholder="Please enter your message subject"
                        onChange={props.onChange}/>
                    {props.errors.subject &&
                    <FormLabel
                        className="contacts-form-label">
                        {props.errors.subject}
                    </FormLabel>}
                </FormGroup>
                <FormGroup>
                    <FormControl
                        className="contacts-form-control-message"
                        id="message"
                        name="message"
                        value={props.message}
                        as="textarea"
                        rows="5"
                        placeholder="Please enter your message"
                        onChange={props.onChange}/>
                    {props.errors.message &&
                    <FormLabel
                        className="contacts-form-label">
                        {props.errors.message}
                    </FormLabel>}
                </FormGroup>
                <Row className="m-0">
                    <Button
                        className="contacts-message-button"
                        type="submit"
                        disabled={props.isDisabled}>SEND YOUR MESSAGE</Button>
                </Row>
                {props.Recaptcha}
            </Form>
        </div>
    );
}

export default ContactsMailForm;
