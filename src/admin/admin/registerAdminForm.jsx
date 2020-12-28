import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import {toast} from "react-toastify";
import {FormLabel} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import {registerAdmin} from "../../services/adminService";

class RegisterAdminForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: "",
            adminEmail: "",
            adminPassword: "",
            isAdmin: false,
            errors: {},
            isDisabled: true
        }
    };

    schema = Joi.object({
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

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            isDisabled: false
        });
    }


    validateAdminInput = () => {
        const admin = {
            adminName: this.state.adminName,
            adminEmail: this.state.adminEmail,
            adminPassword: this.state.adminPassword,
            isAdmin: this.state.isAdmin
        };
        const options = {abortEarly: false};
        const result = this.schema.validate(admin,options);
        console.log(result);

        if(!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }


    handleSubmit = async (event) =>{
      event.preventDefault();
      const errors = this.validateAdminInput();
      this.setState({errors: errors || {}});
      if(errors) return;
      this.setState({isDisabled: true});

      const admin = {
          adminName: this.state.adminName,
          adminEmail: this.state.adminEmail,
          adminPassword: this.state.adminPassword,
          isAdmin: this.state.isAdmin
      };

      await registerAdmin(admin);
      toast.success('Admin registration was successful!');

    }



    adminRedirect = () =>{
        this.props.history.push("/admin")
    }

    render() {
        return (
            <div>
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <FormLabel>
                                Admin Name
                            </FormLabel>
                            <FormControl
                                autoFocus={true}
                                id="adminName"
                                name="adminName"
                                type="text"
                                value={this.state.adminName}
                                placeholder="Enter Admin's name"
                                onChange={this.handleChange}/>
                            {this.state.errors.adminName &&
                            <span className="text-danger pt-2">
                                {this.state.errors.adminName}
                            </span>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>
                                Admin Email
                            </FormLabel>
                            <FormControl
                                id="adminEmail"
                                name="adminEmail"
                                type="email"
                                value={this.state.adminEmail}
                                placeholder="Enter Admin's email"
                                onChange={this.handleChange}/>
                            {this.state.errors.adminEmail &&
                            <span className="text-danger pt-2">
                                {this.state.errors.adminEmail}
                            </span>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>
                                Admin Password
                            </FormLabel>
                            <FormControl
                                id="adminPassword"
                                name="adminPassword"
                                type="password"
                                value={this.state.adminPassword}
                                placeholder="Enter Admin's password"
                                onChange={this.handleChange}/>
                            {this.state.errors.adminPassword &&
                            <span className="text-danger pt-2">
                                {this.state.errors.adminPassword}
                            </span>}
                        </FormGroup>
                        <FormGroup>
                            <FormCheck
                                id="isAdmin"
                                name="isAdmin"
                                type="checkbox"
                                value={this.state.isAdmin}
                                label="Define Admin rights"
                                onChange={this.handleChange}/>
                        </FormGroup>
                        <Row>
                            <Col>
                                <Button
                                    type="submit"
                                    disabled={this.state.isDisabled}>
                                    REGISTER ADMIN
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={this.adminRedirect}>
                                    BACK TO ADMIN PANEL
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default RegisterAdminForm;
