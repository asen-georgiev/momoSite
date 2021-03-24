import React from 'react';
import Card from "react-bootstrap/Card";
import {CardDeck} from "react-bootstrap";
import photogaphy from "../assets/photography.jpg";
import design from "../assets/design.jpg";
import prepress from "../assets/prepress.jpg";
import CardImg from "react-bootstrap/CardImg";
import "../css/homepage/homepage.css";
import {Link} from "react-router-dom";

function HomepageCards(props) {
    return (
        <CardDeck>
            <Card className="homepage-card">
                <CardImg
                variant="top"
                src={photogaphy}
                style={{height:400}}/>
                <Card.Header className="homepage-cardheader">
                    PHOTOGRAPHY
                </Card.Header>
                <Card.Body className="homepage-cardbody">
                    <Card.Text>
                        Donec et hendrerit odio. Pellentesque facilisis lectus et lectus dignissim,
                        in auctor erat pharetra. Pellentesque consequat nulla eget ex tempor, eu scelerisque
                        purus bibendum. Donec diam metus, consectetur a elit tristique, commodo rutrum nibh.
                        Donec aliquet interdum magna et bibendum. Pellentesque rhoncus nec enim vitae lobortis.
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-right">
                    <Link
                        className="homepage-foot-link"
                        to="/designs">
                        <span>MORE...</span>
                    </Link>
                </Card.Footer>
            </Card>
            <Card className="homepage-card">
                <CardImg
                variant="top"
                src={design}
                style={{height:400}}/>
                <Card.Header className="homepage-cardheader">
                    GRAPHIC DESIGN
                </Card.Header>
                <Card.Body className="homepage-cardbody">
                    <Card.Text>
                        Donec et hendrerit odio. Pellentesque facilisis lectus et lectus dignissim,
                        in auctor erat pharetra. Pellentesque consequat nulla eget ex tempor, eu scelerisque
                        purus bibendum. Donec diam metus, consectetur a elit tristique, commodo rutrum nibh.
                        Donec aliquet interdum magna et bibendum. Pellentesque rhoncus nec enim vitae lobortis.
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-right">
                    <Link
                        className="homepage-foot-link"
                        to="/designs">
                        <span>MORE...</span>
                    </Link>
                </Card.Footer>
            </Card>
            <Card className="homepage-card">
                <CardImg
                variant="top"
                src={prepress}
                style={{height:400}}/>
                <Card.Header className="homepage-cardheader">
                    PREPRESS
                </Card.Header>
                <Card.Body className="homepage-cardbody">
                    <Card.Text>
                        Donec et hendrerit odio. Pellentesque facilisis lectus et lectus dignissim,
                        in auctor erat pharetra. Pellentesque consequat nulla eget ex tempor, eu scelerisque
                        purus bibendum. Donec diam metus, consectetur a elit tristique, commodo rutrum nibh.
                        Donec aliquet interdum magna et bibendum. Pellentesque rhoncus nec enim vitae lobortis.
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-right">
                    <Link
                        className="homepage-foot-link"
                        to="/designs">
                        <span>
                            MORE...
                        </span>
                    </Link>
                </Card.Footer>
            </Card>
        </CardDeck>
    );
}

export default HomepageCards;
