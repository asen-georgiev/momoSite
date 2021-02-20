import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import {Button, Image} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {picUrl} from "../../config.json";
import {deleteBlog, getBlogs} from "../../services/blogService";

class AllBlogsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: []
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
            toast.success(`Blog : ${blog.blogTitle} was successfully deleted!`);
        } catch (e) {
            if (e.response && e.response.status === 404) console.log('Blog with the given ID was not found');
            toast.error("This Blog has already been deleted!");
            this.setState({blogs: allBlogs});
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
                            <h2>All created Blogs table :</h2>
                        </Col>
                    </Row>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Sub Title</th>
                            <td>Date</td>
                            <th>Text</th>
                            <th>Pictures</th>
                            <th>Link</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.blogs.map(blog => {
                            return (
                                <tr key={blog._id}>
                                    <td>{blog.blogTitle}</td>
                                    <td>{blog.blogSubTitle}</td>
                                    <td>{new Date(blog.blogDate).toLocaleString()}</td>
                                    <td>{blog.blogText}</td>
                                    <td>
                                        {blog.blogPictures.map(bp => {
                                            return (
                                                <Image
                                                    key={bp}
                                                    src={picUrl + bp}
                                                    width="70"
                                                    height="70"
                                                    className="m-1"/>
                                            )
                                        })}
                                    </td>
                                    <td>{blog.blogLink}</td>
                                    <td>
                                        <Link to={`/admin/blogslist/${blog._id}`}>
                                            Update
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.handleDelete(blog)}>
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
};

export default AllBlogsList;