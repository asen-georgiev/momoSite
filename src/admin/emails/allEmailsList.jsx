import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {deleteEmail, getAllEmails} from "../../services/emailService";

class AllEmailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: []
        }
    }

    async componentDidMount() {
        const {data: emails} = await getAllEmails();
        this.setState({emails});
        console.log(this.state);
    }

    handleDelete = async (email) => {
        const allEmails = this.state.emails;
        const emails = allEmails.filter(eml => eml._id !== email._id);
        this.setState({emails});

        try {
            await deleteEmail(email._id);
            toast.success("Email was successfully deleted!");
        } catch (e) {
            if (e.response && e.response.status === 404)
                console.log('Email with the given ID was not found!');
            toast.error('This email has already been deleted!');
            this.setState({emails: allEmails});
        }
    }

    adminRedirect = () => {
        this.props.history.push("/admin");
    }


    render() {
        return (
            <div>
                <Container>
                    <Table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.emails.map(eml => {
                            return (
                                <tr key={eml._id}>
                                    <td>{eml.fullname}</td>
                                    <td>{eml.email}</td>
                                    <td>{eml.subject}</td>
                                    <td>{eml.message}</td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(eml)}>
                                            DELETE
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                    <Button onClick={this.adminRedirect}>
                        BACK TO ADMIN PANEL
                    </Button>
                </Container>
            </div>
        );
    }
}

export default AllEmailsList;
