import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import {toast, Zoom} from "react-toastify";
import {FormLabel} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import "../../css/admin/adminUpdate.css";
import {getAdmin, updateAdmin} from "../../services/adminService";

class UpdateAdminForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: {
                adminName: "",
                adminEmail: "",
                adminPassword: "",
                isAdmin: false
            },
            errors: {},
            isDisabled: true
        }

    }

    schema = Joi.object({
        _id: Joi.string(),
        adminName: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Admin Name"),
        adminEmail: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Admin Email"),
        adminPassword: Joi.string()
            .required()
            .min(8)
            .max(255)
            .label("Admin Password"),
        isAdmin: Joi.boolean()
            .label("Is Admin")
    });


    handleChange = (event) => {
        const admin = {...this.state.admin};
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        admin [name] = value;
        this.setState({
            admin,
            isDisabled: false
        })
    }


    async populateAdmin() {
        try {
            const adminId = this.props.match.params.id;
            const {data: admin} = await getAdmin(adminId);
            this.setState({admin: this.mapToViewModel(admin)});
        } catch (e) {
            if (e.response && e.response.status === 404)
                console.log('There is no Admin with the given ID!');
        }
    }

    async componentDidMount() {
        await this.populateAdmin();
    }

    mapToViewModel(admin) {
        return {
            _id: admin._id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            // adminPassword: admin.adminPassword,
            isAdmin: admin.isAdmin
        };
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const errors = this.validateAdminInput();
        this.setState({errors: errors || {}});
        if (errors) return;

        const admin = {
            adminName: this.state.admin.adminName,
            adminEmail: this.state.admin.adminEmail,
            adminPassword: this.state.admin.adminPassword,
            isAdmin: this.state.admin.isAdmin
        };

        await updateAdmin(admin, this.state.admin._id);
        this.setState({isDisabled: true});
        toast('Admin update was successful!', {
            position: "top-center",
            transition: Zoom,
            className: 'update-toaster'
        });
    }


    validateAdminInput = () => {
        const admin = {
            adminName: this.state.admin.adminName,
            adminEmail: this.state.admin.adminEmail,
            adminPassword: this.state.admin.adminPassword,
            isAdmin: this.state.admin.isAdmin
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(admin, options);
        console.log(result);

        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    adminRedirect = () => {
        this.props.history.push("/admin/adminslist")
    }


    render() {
        return (
            <div>
                <Container className="update-main-container" fluid={true}>
                    <Container className="update-sub-container container" fluid={true}>
                        <Row>
                            <Col>
                                <div className="update-div-form">
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup className="px-5 pt-4">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Name*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="update-form-control"
                                                autoFocus={true}
                                                id="adminName"
                                                name="adminName"
                                                type="text"
                                                value={this.state.admin.adminName}
                                                placeholder={this.state.errors.adminName || "Enter Admin's name"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Email*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="update-form-control"
                                                id="adminEmail"
                                                name="adminEmail"
                                                type="email"
                                                value={this.state.admin.adminEmail}
                                                placeholder={this.state.errors.adminEmail || "Enter Admin's email"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            {/*<FormLabel>*/}
                                            {/*    Admin Password*/}
                                            {/*</FormLabel>*/}
                                            <FormControl
                                                className="update-form-control"
                                                id="adminPassword"
                                                name="adminPassword"
                                                type="password"
                                                value={this.state.admin.adminPassword}
                                                placeholder={this.state.errors.adminPassword || "Enter Admin's password"}
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup className="px-5 pt-2">
                                            <FormCheck
                                                className="update-checkbox"
                                                id="isAdmin"
                                                name="isAdmin"
                                                type="checkbox"
                                                checked={this.state.admin.isAdmin}
                                                value={this.state.admin.isAdmin}
                                                label="User will have Admin rights"
                                                onChange={this.handleChange}/>
                                        </FormGroup>
                                        <Row className="px-5 pb-5 py-2 d-flex justify-content-between">
                                            <Col>
                                                <Button
                                                    className="update-update-button"
                                                    type="submit"
                                                    disabled={this.state.isDisabled}>
                                                    UPDATE ADMIN
                                                </Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    className="update-redirect-button"
                                                    onClick={this.adminRedirect}>
                                                    BACK TO ADMINS LIST
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

export default UpdateAdminForm;
