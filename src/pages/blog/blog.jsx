import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
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
import {paginateFunction} from "../../services/paginateFunction";
import Paginate from "../../components/paginate";

class Blog extends Component {
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
        this.setState({
            blogs
        });
    }

    handlePageChange = (pageNumber) => {
        this.setState({currentPage: pageNumber});
    }


    render() {

        const paginatedBlogs = paginateFunction(this.state.blogs, this.state.blogsPerPage, this.state.currentPage);

        return (
            <div>
                <Container className="blogpage-main" fluid={true}>
                    <Row className="blogpage-title-row">
                        <Col
                            style={{height: 400}}
                            className="d-flex flex-column text-center justify-content-center">
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
                            <Row className="m-0">
                                <Col md="auto" className='p-0 py-5'>
                                    <Image
                                        className="px-4"
                                        src={maria}
                                        style={{width: 430, height: "auto"}}/>
                                </Col>
                                <Col className='d-flex flex-column px-4 pt-5'>
                                    <ul className="blogpage-ul">
                                        <li>name : MARIA TASHKOVA</li>
                                        <li>born : 19.09.1979</li>
                                        <li>nationality : BULGARIAN</li>
                                        <li>education : ECONOMICS AND MANAGEMENT</li>
                                        <li>current : GRAPHIC DESIGNER / PHOTOGRAPHER</li>
                                    </ul>
                                    <ul className="blogpage-ul">
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faFacebookSquare}/>
                                                <span>Facebook</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faInstagramSquare}/>
                                                <span>Instagram</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faTwitterSquare}/>
                                                <span>Twitter</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faLinkedin}/>
                                                <span>LinkedIn</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <ul className="blogpage-ul">
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faPhoneSquare}/>
                                                <span>+359/123456789</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="blogpage-info-link">
                                                <FontAwesomeIcon
                                                    className="icon mr-2"
                                                    icon={faMailBulk}/>
                                                <span>tashkovamaria@gmail.com</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                            <Row
                                className="blogpage-work-row">
                                <Col className="d-flex flex-column text-center justify-content-center"
                                     style={{height: 200}}>
                                    <Link
                                        className="blogpage-work-link"
                                        id="Designs"
                                        to="/designs">
                                        <span>TAKE A LOOK AT MY WORK</span>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="blogpage-cards-col">
                            <Row className="mx-3 mt-4 justify-content-between">
                                <Paginate
                                    itemsCount={this.state.blogs.length}
                                    itemsPerPage={this.state.blogsPerPage}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}/>
                                <span className="blogpage-span">BLOG EVENTS</span>
                            </Row>
                            <Row>
                                <Col className="p-0 overflow-auto" style={{height: 700}}>
                                    {paginatedBlogs.map(blog => {
                                            return (
                                                <Card key={blog._id} className="blogpage-card mt-2">
                                                    <Card.Header>
                                                        Date : {new Date(blog.blogDate).toLocaleString()}
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Card.Title className="blogpage-card-title">
                                                            {blog.blogTitle}
                                                        </Card.Title>
                                                        <Card.Text>
                                                            {blog.blogSubTitle}
                                                        </Card.Text>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Link
                                                            className="blogpage-card-link"
                                                            to={`/blog/${blog._id}`}>
                                                            Continue reading...
                                                        </Link>
                                                    </Card.Footer>
                                                </Card>
                                            )
                                        }
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Blog;
