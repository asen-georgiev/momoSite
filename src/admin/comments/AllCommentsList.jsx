import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast, Zoom} from "react-toastify";
import _ from "lodash";
import {deleteComment, getComments} from "../../services/commentService";
import "../../css/admin/comments/commentAllList.css";
import Paginate from "../../components/paginate";
import {paginateFunction} from "../../services/paginateFunction";

class AllCommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentsPerPage: 5,
            currentPage: 1
        }
    }


    async componentDidMount() {
        const {data: comments} = await getComments();
        //Creating new array with objects by unique 'userEmail
        const uniqList = _.uniqBy(comments,'userEmail');
        console.log(uniqList);
        this.setState({
            comments
        });
    }


    handleDelete = async (comment) => {
        const allComments = this.state.comments;
        const comments = allComments.filter(c => c._id !== comment._id);
        this.setState({comments});
        try {
            await deleteComment(comment._id);
            toast('Comment was successfully deleted!', {
                position: "top-center",
                transition: Zoom,
                className: 'commentlist-toaster'
            });
        } catch (e) {
            if (e.response && e.response.status === 404) console.log('Comment with given ID was not found!');
            toast.error('This comment has already been deleted!');
            this.setState({
                comments: allComments
            });
        }

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

        const paginatedComments = paginateFunction(this.state.comments, this.state.commentsPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="commentlist-main-container" fluid={true}>
                    <Container className="commentlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <Col className="commentlist-span-col">
                                <span className="commentlist-span">All users Comments :</span>
                            </Col>
                            <Col className="commentlist-span-col d-flex justify-content-end">
                                <Paginate
                                    className="m-0"
                                    itemsCount={this.state.comments.length}
                                    itemsPerPage={this.state.commentsPerPage}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}/>
                            </Col>
                        </Row>
                        <Table responsive hover className="commentlist-table">
                            <thead className="commentlist-thead">
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="commentlist-tbody">
                            {paginatedComments.map(comment => {
                                return (
                                    <tr>
                                        <td>{comment.user.userName} {comment.user.userFamily}</td>
                                        <td>{comment.user.userEmail}</td>
                                        <td>
                                            <div
                                                className="overflow-auto"
                                                style={{height: 150}}>
                                                {comment.commentText}
                                            </div>
                                        </td>
                                        <td>{new Date(comment.commentDate).toLocaleString()}</td>
                                        <td>
                                            <Button
                                                className="commentlist-delete-button"
                                                onClick={() => this.handleDelete(comment)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                                </tbody>
                                </Table>
                                <Button
                                className="commentlist-redirect-button"
                                onClick={this.adminRedirect}>
                                BACK TO ADMIN PANEL
                                </Button>
                                </Container>
                                </Container>
                                </div>
                                );
                            }
}

export default AllCommentsList;
