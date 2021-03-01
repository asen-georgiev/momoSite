import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
import {deleteDesign, getDesigns} from "../../services/designService";

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
            toast.success(`Design : ${design.designTitle} was successfully deleted!`);
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
                <Container className="container" fluid={true}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Text</th>
                            <th>Pictures</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
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
                                        <Link to={`/admin/designslist/${design._id}`}>
                                            Update
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(design)}>
                                            Delete
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

export default AllDesignsList;
