import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast, Zoom} from "react-toastify";
import {deleteComment, getComments} from "../../services/commentService";
import "../../css/admin/comments/commentAllList.css";

class AllCommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }
    }


    async componentDidMount() {
        const {data: comments} = await getComments();
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


    adminRedirect = () => {
        this.props.history.push("/admin");
    }

    render() {
        return (
            <div>
                <Container className="commentlist-main-container" fluid={true}>
                    <Container className="commentlist-sub-container container" fluid={true}>
                        <Row className="m-0">
                            <span className="commentlist-span">All users Comments :</span>
                        </Row>
                        <Table responsive hover className="commentlist-table">
                            <thead className="commentlist-thead">
                            <tr>
                                <th>User</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="commentlist-tbody">
                            {this.state.comments.map(comment => {
                                return (
                                    <tr>
                                        <td>{comment.user.userName} {comment.user.userFamily}</td>
                                        <td>{comment.commentText}</td>
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
