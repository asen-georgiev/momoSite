import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast, Zoom} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
import {deleteBlog, getBlogs} from "../../services/blogService";
import "../../css/admin/blogs/blogAllList.css";
import Paginate from "../../components/paginate";
import {paginateFunction} from "../../services/paginateFunction";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class AllBlogsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            blogsPerPage: 3,
            currentPage: 1
        }
    }


    async componentDidMount() {
        const {data: blogs} = await getBlogs();
        this.setState({blogs});
        console.log(this.state.blogs);
    }


    handleDelete = async (blog) => {
        const allBlogs = this.state.blogs;
        const blogs = allBlogs.filter(b => b._id !== blog._id);
        this.setState({blogs});
        try {
            await deleteBlog(blog._id);
            toast(`Blog : ${blog.blogTitle} was successfully deleted!`, {
                position: "top-center",
                transition: Zoom,
                className: 'bloglist-toaster'
            });
        } catch (e) {
            if (e.response && e.response.status === 404) console.log('Blog with the given ID was not found');
            toast.error("This Blog has already been deleted!");
            this.setState({blogs: allBlogs});
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

        const paginatedBlogs = paginateFunction(this.state.blogs, this.state.blogsPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="bloglist-main-container" fluid={true}>
                    <Container className="bloglist-sub-container">
                        <Row className="m-0">
                            <Col className="bloglist-span-col">
                                <span className="bloglist-span">All created Blogs :</span>
                            </Col>
                            <Col className="biolist-span-col d-flex justify-content-end">
                                <Paginate
                                    className="m-0"
                                    itemsCount={this.state.blogs.length}
                                    itemsPerPage={this.state.blogsPerPage}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}/>
                            </Col>
                        </Row>
                        <Table responsive hover className="bloglist-table">
                            <thead className="bloglist-thead">
                            <tr>
                                <th>Title</th>
                                <th>Sub Title</th>
                                <th>Date</th>
                                <th>Text</th>
                                <th>Pictures</th>
                                <th>Link</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody className="bloglist-tbody">
                            {paginatedBlogs.map(blog => {
                                return (
                                    <tr key={blog._id}>
                                        <td>{blog.blogTitle}</td>
                                        <td>
                                            <div
                                                className="overflow-auto"
                                                style={{height: 250}}>
                                                {blog.blogSubTitle}
                                            </div>
                                        </td>
                                        <td>{new Date(blog.blogDate).toLocaleString()}</td>
                                        <td>
                                            <div
                                                className="overflow-auto"
                                                style={{height: 250}}>
                                                {blog.blogText}
                                            </div>
                                        </td>
                                        <td>
                                            {blog.blogPictures.map(bp => {
                                                return (
                                                    <Image
                                                        key={bp}
                                                        src={pictureUrl + bp}
                                                        width="70"
                                                        height="70"
                                                        className="m-1"/>
                                                )
                                            })}
                                        </td>
                                        <td>{blog.blogLink}</td>
                                        <td>
                                            <Link
                                                className="bloglist-link"
                                                to={`/admin/blogslist/${blog._id}`}>
                                                Update
                                            </Link>
                                        </td>
                                        <td>
                                            <Button
                                                className="bloglist-delete-button"
                                                onClick={() => this.handleDelete(blog)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Button
                            className="bloglist-redirect-button"
                            onClick={this.adminRedirect}>
                            BACK TO ADMIN PANEL
                        </Button>
                    </Container>
                </Container>
            </div>
        );
    }
};

export default AllBlogsList;
