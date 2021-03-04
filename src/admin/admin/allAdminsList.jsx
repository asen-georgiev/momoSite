import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {toast, Zoom} from "react-toastify";
import "../../css/admin/adminAllList.css";
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
            toast(`Admin : ${admin.adminName} was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'adminlist-toaster'
            });
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
                <Container className="adminlist-main-container" fluid={true}>
                    <Container className="adminlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="adminlist-span">All registered Admins :</span>
                        </Row>
                        <Table responsive className="adminlist-table">
                            <thead className="adminlist-thead">
                            <tr>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Admin rights</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="adminlist-tbody">
                            {this.state.admins.map(adm => {
                                return (
                                    <tr key={adm._id}>
                                        <td>{adm.adminName}</td>
                                        <td>{adm.adminEmail}</td>
                                        {adm.isAdmin && <td>admin</td>}
                                        {!adm.isAdmin && <td>suspended</td>}
                                        <td>
                                            <Link
                                                className="adminlist-link"
                                                to={`/admin/adminslist/${adm._id}`}>
                                                Update
                                            </Link>
                                        </td>
                                        <td>
                                            <Button
                                                className="adminlist-delete-button"
                                                onClick={() => this.handleDelete(adm)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Button
                            className="adminlist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllAdminsList;
