import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import {toast} from "react-toastify";
import {picUrl} from "../../config.json";
import {Link} from "react-router-dom";
import {deleteUserAdmin, getAllUsers} from "../../services/userService";
import Image from "react-bootstrap/Image";
import "../../css/admin/user/userAllList.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {paginateFunction} from "../../services/paginateFunction";
import Paginate from "../../components/paginate";


const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class AllUsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usersPerPage: 3,
            currentPage: 1
        }
    }

    async componentDidMount() {
        const {data: users} = await getAllUsers();
        this.setState({users});
        console.log(this.state.users);
    }

    handleDelete = async (user) => {
        const allUsers = this.state.users;
        const users = allUsers.filter(u => u._id !== user._id);
        this.setState({users});

        try {
            await deleteUserAdmin(user._id);
        } catch (error) {
            if (error.response && error.response.status === 404)
                console.log("User with the given ID was not found");
            toast.error("This user has already been deleted");
            this.setState({users: allUsers});
        }
    }


    handlePageChange = (pageNumber) => {
        this.setState({currentPage: pageNumber});
    }


    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {

        const paginatedUsers = paginateFunction(this.state.users, this.state.usersPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="userlist-main-container" fluid={true}>
                    <Container className="userlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <Col className="userlist-span-col">
                            <span className="userlist-span">All registered Users :</span>
                            </Col>
                            <Col className="userlist-span-col d-flex justify-content-end">
                            <Paginate
                                className="m-0"
                                itemsCount={this.state.users.length}
                                itemsPerPage={this.state.usersPerPage}
                                currentPage={this.state.currentPage}
                                onPageChange={this.handlePageChange}/>
                            </Col>
                        </Row>
                        <Table responsive hover className="userlist-table">
                            <thead className="userlist-thead">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Picture</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="userlist-tbody">
                            {paginatedUsers.map(usr => {
                                return (
                                    <tr key={usr._id}>
                                        <td>{usr.userName} {usr.userFamily}</td>
                                        <td>{usr.userEmail}</td>
                                        <td>
                                            <Image
                                                src={pictureUrl + usr.userPicture}
                                                width="100"
                                                height="100"/>
                                        </td>
                                        <td>
                                            <Link
                                                className="userlist-link"
                                                to={`/admin/userslist/${usr._id}`}>
                                                Update user
                                            </Link>
                                        </td>
                                        <td>
                                            <Button
                                                className="userlist-delete-button"
                                                onClick={() => this.handleDelete(usr)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Button
                            className="userlist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllUsersList;
