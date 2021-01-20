import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {deleteUserAdmin, getAllUsers} from "../../services/userService";


class AllUsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
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
                        <th>Update</th>
                        <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map(usr => {
                            return (
                                <tr key={usr._id}>
                                    <td>{usr.userName} {usr.userFamily}</td>
                                    <td>{usr.userEmail}</td>
                                    <td>
                                        <Link
                                        to={`/admin/userslist/${usr._id}`}>
                                            Update user
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(usr)}>
                                            Delete user
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                    <Button
                        onClick={this.adminRedirect}>
                        BACK TO ADMIN PANEL
                    </Button>
                </Container>
            </div>
        );
    }
}

export default AllUsersList;
