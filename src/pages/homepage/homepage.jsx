import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../css/homepage/homepage.css";
import HomepageCards from "../../components/homepageCards";


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
                </Container>
            </div>
        );
    }
}

export default Homepage;
