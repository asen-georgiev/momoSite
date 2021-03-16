import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {getBlogs} from "../../services/blogService";
import "../../css/blog/blogPage.css";
import Image from "react-bootstrap/Image";
import maria from "../../assets/maria.jpg";
import {faPhoneSquare} from "@fortawesome/free-solid-svg-icons/faPhoneSquare";
import {faMailBulk} from "@fortawesome/free-solid-svg-icons/faMailBulk";
import {faFacebookSquare} from "@fortawesome/free-brands-svg-icons/faFacebookSquare";
import {faInstagramSquare} from "@fortawesome/free-brands-svg-icons/faInstagramSquare";
import {faTwitterSquare} from "@fortawesome/free-brands-svg-icons/faTwitterSquare";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons/faLinkedin";

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
                <Container className="blogpage-main" fluid={true}>
                    <Row className="blogpage-title-row justify-content-center align-content-center">
                        <Col className="d-flex flex-column text-center">
                            <span className="blogpage-title-span">
                                MOMO DESIGN BLOG
                            </span>
                            <span className="blogpage-subtitle-span">
                                Donec in libero nec magna molestie dignissim. Aenean placerat porta laoreet.
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="blogpage-info-col">
                            <Row>
                                <Col md="auto" className='p-0'>
                                    <Image
                                        className="p-4"
                                        src={maria}
                                        style={{width: 430, height: "auto"}}/>
                                </Col>
                                <Col className='d-flex flex-column p-4'>
                                    <ul className="blogpage-ul">
                                        <li>name : MARIA TASHKOVA</li>
                                        <li>born : 19.09.1979</li>
                                        <li>nationality : BULGARIAN</li>
                                        <li>education : ECONOMICS AND MANAGEMENT</li>
                                        <li>current : GRAPHIC DESIGNER / PHOTOGRAPHER</li>
                                    </ul>
                                    <ul className="blogpage-ul">
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faFacebookSquare}/>
                                                <span>Facebook</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faInstagramSquare}/>
                                                <span>Instagram</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faTwitterSquare}/>
                                                <span>Twitter</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faLinkedin}/>
                                                <span>LinkedIn</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <ul className="blogpage-ul">
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faPhoneSquare}/>
                                                <span>+359/123456789</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faMailBulk}/>
                                                <span>tashkovamaria@gmail.com</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                            <Row className="bg-info" style={{height:100}}>
                                Take a look at my work!
                            </Row>
                        </Col>
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
                                                    Continue reading...
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
