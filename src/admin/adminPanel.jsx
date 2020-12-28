import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import {getCurrentAdmin,adminLogout} from "../services/adminLoginService";
import jwtDecode from "jwt-decode";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin:[]
        }
    }

    componentDidMount() {
        const jwtAdmin = getCurrentAdmin();
        const admin = jwtDecode(jwtAdmin);
        this.setState({admin});
        console.log(admin);
    }

    logoutAdmin = () =>{
        adminLogout();
        this.props.history.push("/adminlogin");
    }

    render() {
        return (
            <div>
                <Container>
                    <h3>Logged as: {this.state.admin.adminName}</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>Element name</th>
                                <th>Create new</th>
                                <th>To list</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Admins</td>
                                <td>
                                    <Link to="/admin/registeradmin">
                                        Register
                                    </Link>
                                </td>
                                <td>
                                    <Link to="/admin/adminslist">
                                        All Admins list
                                    </Link>
                                </td>
                            </tr>
                        <tr>
                            <td>Users</td>
                            <td>Register</td>
                            <td>All Users list</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Button
                        onClick={this.logoutAdmin}>
                        Logout
                    </Button>
                </Container>
            </div>
        );
    }
}

export default AdminPanel;
