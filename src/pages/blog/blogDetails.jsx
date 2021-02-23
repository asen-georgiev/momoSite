import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {getBlog} from "../../services/blogService";
import {picUrl} from "../../config.json";
import {getCommentsByBlog} from "../../services/commentService";
import BlogCard from "../../components/blogCard";
import Image from 'react-bootstrap/Image'
import BlogComments from "../../components/blogComments";

class BlogDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: '',
            comments: []
        }
    }

    async componentDidMount() {
        const blogId = this.props.match.params.id;
        const {data: blog} = await getBlog(blogId);
        const {data: comments} = await getCommentsByBlog(blogId);
        this.setState({
            blog,
            comments
        });
    }

    render() {
        return (
            <div>
                <Container className="container" fluid={true}>
                    <Row>
                        <Col>
                            <BlogCard
                                items={this.state.blog}/>
                        </Col>
                    </Row>
                    {this.state.comments &&
                    <Row>
                        <Col>
                            <BlogComments
                                comments={this.state.comments}
                            />
                        </Col>
                    </Row>}
                </Container>
            </div>
        );
    }
}

export default BlogDetails;
