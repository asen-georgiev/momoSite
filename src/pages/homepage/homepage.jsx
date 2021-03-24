import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import "../../css/homepage/homepage.css";
import HomepageCards from "../../components/homepageCards";
import profile from "../../assets/profile.png"
import Image from "react-bootstrap/Image";


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <Container className="homepage-main" fluid={true}>
                    <Row>
                        <Col className="homepage-title-col d-flex flex-column text-center justify-content-center">
                            <span className="homepage-title-span">
                                WELCOME TO MOMO DESIGN
                            </span>
                            <span className="homepage-subtitle-span">
                                Sed rutrum pharetra mauris at lobortis. Aenean at placerat nisi, a vulputate sem.
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="homepage-cards-col p-5">
                            <HomepageCards/>
                        </Col>
                    </Row>
                    <Row className="pl-5 pr-5 pb-5">
                        <Col
                            className="homepage-mission-col d-flex flex-column text-center justify-content-center p-5">
                            <span className="homepage-mission-span">
                                OUR MISSION AND GOALS
                            </span>
                            <hr/>
                            <p className="homepage-mission-p">
                                Vestibulum lobortis maximus libero ac rhoncus.<br/>
                                Sed volutpat rutrum diam sed laoreet. Aliquam sit amet rhoncus purus, vitae condimentum
                                nibh.<br/>
                                Donec ac ornare arcu. Aliquam bibendum nulla mauris, ut ullamcorper tellus viverra eget.<br/>
                                Curabitur porta lorem vitae aliquam eleifend.<br/>
                                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                                egestas.<br/>
                                In commodo lacus nec lorem feugiat fringilla.
                            </p>
                            <Link
                                className="homepage-mission-link"
                                to="/contacts">
                                <span>
                                    CONTACT US
                                </span>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>
                                MARIA TASHKOVA
                            </span>
                            <p>

                            </p>
                        </Col>
                        <Col className="bg-danger p-5">
                            <Image
                                style={{width:800}}
                            src={profile}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Homepage;
