import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import {picUrl} from "../../config.json";
import {getDesign} from "../../services/designService";
import "../../css/designs/designDetails.css";
import {Link} from "react-router-dom";


class DesignsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            design: {
                designPictures: [],
                designTitle: '',
                designText: ''
            },
            mainPicture: '',
            fullScreen: false
        }
    }


    async componentDidMount() {
        const designId = this.props.match.params.id;
        const {data: design} = await getDesign(designId);
        const mainPicture = design.designPictures[0];
        this.setState({
            design,
            mainPicture
        });
        console.log(this.state);
    }


    pictureChange = (picture) => {
        this.setState({
            mainPicture: picture
        })
    }

    showFullscreen = () => {
        this.setState({
            fullScreen: true
        });
    }

    closeFullScreen = () => {
        this.setState({
            fullScreen: false
        });
    }


    render() {
        return (
            <div>
                <Container className="design-details-main" fluid={true}>
                    {this.state.fullScreen &&
                    <Container fluid={true}>
                        <Image
                            onClick={this.closeFullScreen}
                            className="image-overlay"
                            src={picUrl + this.state.mainPicture}
                        />
                    </Container>
                    }
                    <Row>
                        <Col>
                            <Row>
                                <Col className="design-details-leftcol-span p-5 text-center">
                                    <span>{this.state.design.designTitle}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col  id="Span" className="design-details-leftcol p-5">
                                    <Row className="d-flex flex-row justify-content-center">
                                    <span id="show-span" className="show-span">
                                        CLICK ON IMAGE FOR FULLSCREEN
                                    </span>
                                    </Row>
                                    <Image
                                        onClick={this.showFullscreen}
                                        className="design-details-image"
                                        src={picUrl + this.state.mainPicture}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="design-details-rightcol">
                            <Row>
                                <Col
                                    className="design-details-rightcol-images overflow-auto p-5">
                                    {this.state.design.designPictures.map(dp => {
                                        return (
                                            <Image
                                                key={dp}
                                                onClick={() => this.pictureChange(dp)}
                                                className="design-details-images mb-3"
                                                src={picUrl + dp}
                                                style={{width: 525, height: "auto"}}/>
                                        )
                                    })}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="design-details-rightcol-span text-center p-5">
                                        <span>
                                    {this.state.design.designText}
                                        </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="design-details-rightcol-link text-center p-5">
                                    <Link
                                        className="design-details-link"
                                        to="/designs">
                                        <span>
                                        RETURN TO DESIGNS
                                        </span>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

export default DesignsDetails;
