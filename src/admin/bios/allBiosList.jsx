import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
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
            await deleteBio(bio._id);
            toast.success(`Bio : ${bio.bioTitle} was successfully deleted!`);
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
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            <h2>All created Bios table :</h2>
                        </Col>
                    </Row>
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
                                                        width="50"
                                                        height="50"
                                                        className="m-1"/>
                                                )
                                            })
                                            }

                                        </Row>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bioslist/${bio._id}`}>
                                            Update
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(bio)}>
                                            Delete bio
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

export default AllBiosList;
