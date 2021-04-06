import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "../../css/designs/designPage.css";
import {getDesigns} from "../../services/designService";
import {Carousel} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import {picUrl} from "../../config.json";
import {Link} from "react-router-dom";
import _ from 'lodash';
import ListGroupDesigns from "../../components/listGroupDesigns";


const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class Designs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designs: [],
            list: [],
            selectedDesign: {
                designType: 'All'
            }
        }
    }

    async componentDidMount() {
        const {data: designs} = await getDesigns();
        const uniqDesigns = _.uniqBy(designs, 'designType');
        const list = [{designType: 'All'}, ...uniqDesigns];
        this.setState({
            designs,
            list
        })
        console.log(this.state);
    }

    handleDesignSort = (design) => {
        this.setState({
            selectedDesign: design
        });
    }


    render() {

        const filteredByType = this.state.selectedDesign && this.state.selectedDesign._id
            ? this.state.designs.filter(d => d.designType === this.state.selectedDesign.designType)
            : this.state.designs;

        return (
            <div>
                <Container className="designs-main" fluid={true}>
                    <Row>
                        <Col className="designs-title-col d-flex flex-column text-center justify-content-center">
                            <span className="designs-title-span">
                                WE DESIGN YOUR WORLD
                            </span>
                            <span className="designs-subtitle-span">
                                Recreate your imagination through our work
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-5 designs-carousel-col">
                            <Carousel>
                                {filteredByType.map(des => {
                                    return (
                                        <Carousel.Item key={des._id}>
                                            <Row
                                                className="d-flex flex-row justify-content-between designs-carousel-row">
                                                <Link
                                                    to={`/designs/${des._id}`}>
                                                    <Carousel.Caption>
                                                    <span className='designs-carousel-span'>
                                                        {des.designTitle}
                                                    </span>
                                                        <p className='designs-carousel-p'>
                                                            CLICK TO SEE MORE DETAILS...
                                                        </p>
                                                    </Carousel.Caption>
                                                </Link>
                                                <Image
                                                    id="a"
                                                    className="designs-carousel-image"
                                                    src={pictureUrl + des.designPictures[0]}
                                                    style={{width: 610, height: 610}}
                                                    alt="Design N/A"/>
                                                <Image
                                                    className="designs-carousel-image"
                                                    src={pictureUrl + des.designPictures[1]}
                                                    style={{width: 610, height: 610}}
                                                    alt="Design N/A"/>
                                                <Image
                                                    className="designs-carousel-image"
                                                    src={pictureUrl + des.designPictures[2]}
                                                    style={{width: 610, height: 610}}
                                                    alt="Design N/A"/>
                                            </Row>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </Col>
                    </Row>
                    <ListGroupDesigns
                        designs={this.state.list}
                        selectedDesign={this.state.selectedDesign}
                        onDesignSelect={this.handleDesignSort}/>
                </Container>
            </div>
        );
    }
}

export default Designs;
