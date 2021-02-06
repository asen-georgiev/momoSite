import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import {getCurrentAdmin, adminLogout} from "../../services/adminLoginService";
import jwtDecode from "jwt-decode";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {loggedAdmin} from "../../services/adminService";
import TrTdTable from "../../components/trTdTable";


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: [],
        }
    }

    async componentDidMount() {
        const jwtAdmin = getCurrentAdmin();
        const admin = jwtDecode(jwtAdmin);
        this.setState({admin});
        // console.log(aha);
    }

    logoutAdmin = () => {
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
                        <TrTdTable
                            name="Admins"
                            link1Name="Register"
                            link1To="/admin/registeradmin"
                            link2Name="All Admins list"
                            link2To="/admin/adminslist"/>
                        <TrTdTable
                            name="Users"
                            link1Name="Register"
                            link1To="/admin/registeruser"
                            link2Name="All Users list"
                            link2To="/admin/userslist"/>
                        <TrTdTable
                            name="Emails"
                            link1Name="N/A"
                            link1To="/admin/"
                            link2Name="All Emails List"
                            link2To="/admin/emailslist"/>
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
