import React, {Component} from 'react';
import {getBios} from "../../services/bioService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../../css/biography/biography.css";
import {picUrl} from "../../config.json";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class Biography extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bios: []
        }
    }

    async componentDidMount() {
        const {data: bios} = await getBios();
        this.setState({
            bios
        });
    }

    render() {
        return (
            <Container className="biography-main" fluid={true}>
                <Row>
                    <Col className="biography-title-col d-flex flex-column text-center justify-content-center">
                        <span className="biography-title-span">
                            IN THE BEGINNING
                        </span>
                        <span className="biography-subtitle-span">
                            Let me share our history with you
                        </span>
                    </Col>
                </Row>
                {this.state.bios.map((bio, index) => {
                    if (index % 2 === 0) {
                        return (
                            <Row key={bio._id} className="d-flex flex-row">
                                <Col className="biography-reverse-col p-5" md="auto">
                                    {bio.bioPictures.map(bp => {
                                        return (
                                            <Image src={pictureUrl + bp}
                                                   style={{width: 300}}/>
                                        )
                                    })}
                                </Col>
                                <Col
                                    className="biography-col p-5 d-flex flex-column text-center justify-content-center">
                                    <span
                                        className="biography-span-title">
                                        {bio.bioTitle}
                                    </span>
                                    <p className="text-center">{bio.bioText}</p>
                                </Col>
                            </Row>
                        )
                    } else if (index % 2 === 1) {
                        return (
                            <Row key={bio._id} className="d-flex flex-row-reverse">
                                <Col className="biography-col p-5" md="auto">
                                    {bio.bioPictures.map(bp => {
                                        return (
                                            <Image src={pictureUrl + bp}
                                                   style={{width: 300}}/>
                                        )
                                    })}
                                </Col>
                                <Col
                                    className="biography-reverse-col p-5 d-flex flex-column text-center justify-content-center">
                                    <span
                                        className="biography-span-title text-center">
                                        {bio.bioTitle}
                                    </span>
                                    <p className="text-center">{bio.bioText}</p>
                                </Col>
                            </Row>
                        )
                    }
                })}
            </Container>
        );
    }
}

export default Biography;
