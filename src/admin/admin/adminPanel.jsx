import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import {getCurrentAdmin, adminLogout} from "../../services/adminLoginService";
import jwtDecode from "jwt-decode";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "../../css/admin/adminPanel.css";
import Row from "react-bootstrap/Row";
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
    }

    render() {
        return (
            <div>
                <Container className="panel-main-container" fluid={true}>
                    <Container className="panel-sub-container container" fluid={true}>
                        <Row className="m-0">
                    <span className="panel-span">Admin : {this.state.admin.adminName}</span>
                        </Row>
                    <Table hover className="panel-table">
                        <thead className="panel-thead">
                        <tr>
                            <th>Element name</th>
                            <th>Create new</th>
                            <th>To list</th>
                        </tr>
                        </thead>
                        <tbody className="panel-thead">
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
                            name="Bios"
                            link1Name="Create"
                            link1To="/admin/registerbio"
                            link2Name="All Bios list"
                            link2To="/admin/bioslist"/>
                        <TrTdTable
                            name="Blogs"
                            link1Name="Create"
                            link1To="/admin/registerblog"
                            link2Name="All Blogs list"
                            link2To="/admin/blogslist"/>
                        <TrTdTable
                            name="Comments"
                            link1Name="N/A"
                            link1To="/admin/"
                            link2Name="All Comments list"
                            link2To="/admin/commentslist"/>
                        <TrTdTable
                            name="Designs"
                            link1Name="Create"
                            link1To="/admin/registerdesign"
                            link2Name="All Designs list"
                            link2To="/admin/designslist"/>
                        <TrTdTable
                            name="Emails"
                            link1Name="N/A"
                            link1To="/admin/"
                            link2Name="All Emails List"
                            link2To="/admin/emailslist"/>
                        </tbody>
                    </Table>
                    <Button
                        href="/adminlogin"
                        className="panel-logout-button"
                        onClick={this.logoutAdmin}
                    >
                        LOGOUT
                    </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AdminPanel;
