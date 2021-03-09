import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import {toast, Zoom} from "react-toastify";
import "../../css/admin/emails/emailAllList.css";
import {deleteEmail, getAllEmails} from "../../services/emailService";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Paginate from "../../components/paginate";
import {paginateFunction} from "../../services/paginateFunction";

class AllEmailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            emailsPerPage: 5,
            currentPage: 1
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
            toast("Email was successfully deleted!", {
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

    handlePageChange = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        });
    }

    adminRedirect = () => {
        this.props.history.push("/admin");
    }


    render() {

        const paginatedEmails = paginateFunction(this.state.emails, this.state.emailsPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="emaillist-main-container" fluid={true}>
                    <Container className="emaillist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <Col className="emaillist-span-col">
                                <span className="emaillist-span">All users Emails:</span>
                            </Col>
                            <Col className="emaillist-span-col d-flex justify-content-end">
                                <Paginate
                                    className="m-0"
                                    itemsCount={this.state.emails.length}
                                    itemsPerPage={this.state.emailsPerPage}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}/>
                            </Col>
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
                            {paginatedEmails.map(eml => {
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
