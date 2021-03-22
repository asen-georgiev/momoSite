import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Joi from "joi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ContactsMailForm from "../../components/contactsMailForm";
import ReCAPTCHA from "react-google-recaptcha";
import {sendEmail} from "../../services/emailService";
import {toast, Zoom} from "react-toastify";
import "../../css/contacts/contactsPage.css";

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            email: '',
            subject: '',
            message: '',
            isDisabled: true,
            errors: {}
        }
    }

    schema = Joi.object({
        fullname: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Full name"),
        email: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Email"),
        subject: Joi.string()
            .required()
            .min(5)
            .max(255)
            .label("Subject"),
        message: Joi.string()
            .required()
            .min(5)
            .max(1000)
            .label("Message")

    })

    recaptchaRef = React.createRef();

    validateEmail = () => {
        const email = {
            fullname: this.state.fullname,
            email: this.state.email,
            subject: this.state.subject,
            message: this.state.message
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(email,options);
        console.log(result);

        if(!result.error) return null;

        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name] : value,
            isDisabled: false
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateEmail();
        this.setState({errors: errors || {}});
        console.log(errors);
        if(errors) return;

        this.setState({isDisabled: true});

        const email = {
            fullname: this.state.fullname,
            email: this.state.email,
            subject: this.state.subject,
            message: this.state.message
        };

        await sendEmail(email);
        toast('Your message was sent successfully!',{
            position: "top-center",
            transition: Zoom,
            className: 'contacts-message-toaster'
        });
    }

    render() {
        return (
            <div>
                <Container className="contacts-main" fluid={true}>
                    <Row>
                        <Col
                            className="contacts-title-col d-flex flex-column text-center justify-content-center"
                            >
                                <span className="contacts-title-span">
                                    GIVE US YOUR FEEDBACK
                                </span>
                                <span className="contacts-subtitle-span">
                                    Feel free to write and ask us anything
                                </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="contacts-contacts-col d-flex flex-column px-4 pt-5 text-center">
                            <span className="contacts-contacts-span-logo">
                                MOMO DESIGN LTD.
                            </span>
                            <ul className="contacts-ul p-0">
                                <li>CANADA, VANCOUVER BC 2800</li>
                                <li>CANADSKA MURA STR. NO 1</li>
                                <li>TEL:  +359/123456789</li>
                                <li>EMAIL : momodesign@gmail.com</li>
                                <li>FROM : 08.00h. to 17.00h.</li>
                            </ul>
                            <span className="contacts-contacts-span-moto">
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lacus eget ante mattis consectetur et ac ipsum"
                            </span>
                        </Col>
                        <Col className="contacts-form-col px-5 py-4">
                            <ContactsMailForm
                                {...this.state}
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                Recaptcha={
                                    <ReCAPTCHA
                                        ref={this.recaptchaRef}
                                        sitekey="6LeBdTEaAAAAAAWhXFaJJ4ueXpNrLsvQoN1tXR27"
                                        size="invisible"/>
                                }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Contacts;
