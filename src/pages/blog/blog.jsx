import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {getBlogs} from "../../services/blogService";

class Blog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: []
        }
    }

    async componentDidMount() {
        const {data: blogs} = await getBlogs();
        this.setState({
            blogs
        });
    }


    render() {
        return (
            <div>
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            {this.state.blogs.map(blog => {
                                    return (
                                        <Card key={blog._id}>
                                            <Card.Header>
                                                Date : {new Date(blog.blogDate).toLocaleString()}
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title>
                                                    {blog.blogTitle}
                                                </Card.Title>
                                                <Card.Text>
                                                    {blog.blogSubTitle}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Link to={`/blog/${blog._id}`}>
                                                    Read the whole article
                                                </Link>
                                            </Card.Footer>
                                        </Card>
                                    )
                                }
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Blog;
