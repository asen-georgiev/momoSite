import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {deleteAdmin, getAllAdmins, loggedAdmin} from "../../services/adminService";

class AllAdminsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admins: [],
        }
    }


    async componentDidMount() {
        const {data: admins} = await getAllAdmins();
        this.setState({admins});
    }


    handleDelete = async (admin) => {
        const allAdmins = this.state.admins;
        const admins = allAdmins.filter(a => a._id !== admin._id);
        this.setState({admins});

        try {
            await deleteAdmin(admin._id);
            toast.success(`Admin : ${admin.adminName} was successfully deleted!`);
        } catch (e) {
            if (e.response && e.response.status === 404) console.log("Admin with the given ID was not found!");
            toast.error("This Admin has already been deleted.");
            this.setState({admins: allAdmins});
        }
    }


    adminRedirect = () => {
        this.props.history.push("/admin");
    }


    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <h2>All registered Admins table :</h2>
                        </Col>
                    </Row>
                    <Table>
                        <thead>
                        <tr>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Admin rights</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.admins.map(adm => {
                            return (
                                <tr key={adm._id}>
                                    <td>{adm.adminName}</td>
                                    <td>{adm.adminEmail}</td>
                                    {adm.isAdmin && <td>admin</td>}
                                    {!adm.isAdmin && <td>suspended</td>}
                                    <td>
                                        <Link
                                            to={`/admin/adminslist/${adm._id}`}>
                                            Update admin
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(adm)}>
                                            Delete admin
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

export default AllAdminsList;
