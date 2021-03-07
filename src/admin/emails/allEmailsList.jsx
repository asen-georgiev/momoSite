import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import {toast, Zoom} from "react-toastify";
import "../../css/admin/emails/emailAllList.css";
import {deleteEmail, getAllEmails} from "../../services/emailService";
import Row from "react-bootstrap/Row";

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
            toast("Email was successfully deleted!",{
                position: "top-center",
                transition: Zoom,
                className: 'commentlist-toaster'
            });
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
                <Container className="emaillist-main-container" fluid={true}>
                    <Container className="emaillist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="emaillist-span">All users Emails:</span>
                        </Row>
                    <Table responsive hover className="emaillist-table">
                        <thead className="emaillist-thead">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody className="emaillist-tbody">
                        {this.state.emails.map(eml => {
                            return (
                                <tr key={eml._id}>
                                    <td>{eml.fullname}</td>
                                    <td>{eml.email}</td>
                                    <td>{eml.subject}</td>
                                    <td>{eml.message}</td>
                                    <td>
                                        <Button
                                            className="emaillist-delete-button"
                                            onClick={() => this.handleDelete(eml)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                    <Button
                        className="emaillist-redirect-button"
                        onClick={this.adminRedirect}>
                        BACK TO ADMIN PANEL
                    </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllEmailsList;
