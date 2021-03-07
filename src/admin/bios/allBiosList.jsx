import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast, Zoom} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
import "../../css/admin/bios/bioAllList.css";
import {deleteBio, getBios} from "../../services/bioService";


class AllBiosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bios: []
        }
    }

    async componentDidMount() {
        const {data: bios} = await getBios();
        this.setState({bios});
        console.log(this.state.bios);
    }


    handleDelete = async (bio) => {
        const allBios = this.state.bios;
        const bios = allBios.filter(b => b._id !== bio._id);
        this.setState({bios});

        try {
            toast(`Bio : ${bio.bioTitle} was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'biolist-toaster'
            });
            await deleteBio(bio._id);
        } catch (e) {
            if (e.response && e.response.status === 404) console.log("Bio with the given ID was not found!");
            toast.error("This Bio has already been deleted!");
            this.setState({bios: allBios});
        }
    }

    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {
        return (
            <div>
                <Container className="biolist-main-container" fluid={true}>
                    <Container className="biolist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="biolist-span">All created Biographies :</span>
                        </Row>
                        <Table responsive hover className="biolist-table">
                            <thead className="biolist-thead">
                            <tr>
                                <th>Title</th>
                                <th>Text</th>
                                <th>Pictures</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="biolist-tbody">
                            {this.state.bios.map(bio => {
                                return (
                                    <tr key={bio._id}>
                                        <td>{bio.bioTitle}</td>
                                        <td>{bio.bioText}</td>
                                        <td>
                                            <Row className="justify-content-center">
                                                {bio.bioPictures.map(bp => {
                                                    return (
                                                        <Image
                                                            src={picUrl + bp}
                                                            width="70"
                                                            height="70"
                                                            className="m-1"/>
                                                    )
                                                })}
                                            </Row>
                                        </td>
                                        <td>
                                            <Link
                                                className="biolist-link"
                                                to={`/admin/bioslist/${bio._id}`}>
                                                Update
                                            </Link>
                                        </td>
                                        <td>
                                            <Button
                                                className="biolist-delete-button"
                                                onClick={() => this.handleDelete(bio)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Button
                            className="biolist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllBiosList;
