import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast, Zoom} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
import {deleteDesign, getDesigns} from "../../services/designService";
import "../../css/admin/designs/designAllList.css";

class AllDesignsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designs: []
        }
    }


    async componentDidMount() {
        const {data: designs} = await getDesigns();
        this.setState({
            designs
        });
        console.log(this.state.designs);
    }


    handleDelete = async (design) => {
        const allDesigns = this.state.designs;
        const designs = allDesigns.filter(d => d._id !== design._id);
        this.setState({designs});
        try {
            await deleteDesign(design._id);
            toast(`Design : ${design.designTitle} was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'designlist-toaster'
            });
        } catch (e) {
            if (e.response && e.response.status === 404) console.log('Design with the given ID was not found!');
            toast.error('This Design was aleady been deleted!');
            this.setState({
                designs: allDesigns
            });
        }
    }

    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {
        return (
            <div>
                <Container className="designlist-main-container" fluid={true}>
                    <Container className="designlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="designlist-span">All created Designs :</span>
                        </Row>
                        <Table responsive hover className="designlist-table">
                            <thead className="designlist-thead">
                            <tr>
                                <th>Title</th>
                                <th>Text</th>
                                <th>Pictures</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="designlist-tbody">
                            {this.state.designs.map(design => {
                                return (
                                    <tr key={design._id}>
                                        <td>{design.designTitle}</td>
                                        <td>{design.designText}</td>
                                        <td>
                                            {design.designPictures.map(dp => {
                                                return (
                                                    <Image
                                                        key={dp}
                                                        src={picUrl + dp}
                                                        width="70"
                                                        height="70"
                                                        className="m-1"
                                                    />
                                                )
                                            })}
                                        </td>
                                        <td>
                                            <Link
                                                className="designlist-link"
                                                to={`/admin/designslist/${design._id}`}>
                                                Update
                                            </Link>
                                        </td>
                                        <td>
                                            <Button
                                                className="designlist-delete-button"
                                                onClick={() => this.handleDelete(design)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Button
                            className="designlist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllDesignsList;
