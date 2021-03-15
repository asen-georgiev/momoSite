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
import {paginateFunction} from "../../services/paginateFunction";
import Paginate from "../../components/paginate";
import _ from "lodash";
import DropDownDesigns from "../../components/DropDownDesigns";

class AllDesignsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designs: [],
            designsList: [],
            selectedDesign: {designType: 'ALL DESIGNS'},
            designsPerPage: 3,
            currentPage: 1
        }
    }


    async componentDidMount() {
        const {data: designs} = await getDesigns();
        //Sreating new array with objects by unique 'designType'
        const uniqList = _.uniqBy(designs, 'designType');
        const designsList = [{designType: 'ALL DESIGNS'}, ...uniqList]
        this.setState({
            designs,
            designsList
        });
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

    handleDesignSort = (design) => {
        this.setState({
            selectedDesign: design, currentPage: 1
        });
        console.log(design);
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        });
    }

    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {

        const filteredByDesign = this.state.selectedDesign && this.state.selectedDesign._id
            ? this.state.designs.filter(des => des.designType === this.state.selectedDesign.designType)
            : this.state.designs;

        const paginatedDesigns = paginateFunction(filteredByDesign, this.state.designsPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="designlist-main-container" fluid={true}>
                    <Container className="designlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <Col className="designlist-span-col">
                                <span className="designlist-span">All created Designs :</span>
                            </Col>
                            <Col className="designlist-span-col d-flex justify-content-end">
                                <Paginate
                                    className="m-0"
                                    itemsCount={filteredByDesign.length}
                                    itemsPerPage={this.state.designsPerPage}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}/>
                            </Col>
                        </Row>
                        <Table responsive hover className="designlist-table">
                            <thead className="designlist-thead">
                            <tr>
                                <th>Title</th>
                                <th>Text</th>
                                <th>Type</th>
                                <th>Pictures</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="designlist-tbody">
                            {paginatedDesigns.map(design => {
                                return (
                                    <tr key={design._id}>
                                        <td>{design.designTitle}</td>
                                        <td>{design.designText}</td>
                                        <td>{design.designType}</td>
                                        <td style={{width: 40}}>
                                            <div
                                                className="overflow-auto"
                                                style={{height: 200}}>
                                                {design.designPictures.map(dp => {
                                                    return (
                                                        <Image
                                                            key={dp}
                                                            src={picUrl + dp}
                                                            width="150"
                                                            height="150"
                                                            className="mb-1"
                                                        />
                                                    )
                                                })}
                                            </div>
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
                        <Row>
                            <Col>
                        <Button
                            className="designlist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <DropDownDesigns
                                designs={this.state.designsList}
                                designProperty="designType"
                                selectedDesign={this.state.selectedDesign}
                                onSelectDropDown={this.handleDesignSort}/>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default AllDesignsList;
