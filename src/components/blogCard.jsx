import React from 'react';
import Row from "react-bootstrap/Row";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import {picUrl} from "../config.json";
import "../css/blog/blogDetails.css";


function BlogCard(props) {

    const {items, className} = props;
    return (
        <React.Fragment>
            <Card className={className}>
                <Card.Header>
                    Date : {new Date(items.blogDate).toLocaleString()}
                </Card.Header>
                <Card.Body>
                    <Card.Title className="blogdetails-card-title">
                        {items.blogTitle}
                    </Card.Title>
                    {items.blogPictures &&
                    <Row className="justify-content-center">
                        {items.blogPictures.map(bp => {
                            return (
                                <CardImg
                                    key={bp}
                                    className="m-2 blogdetails-card-image"
                                    src={picUrl + bp}/>
                            )
                        })}
                    </Row>}
                    <Card.Text
                        className="mt-4">
                        {items.blogText}
                    </Card.Text>
                </Card.Body>
                {items.blogLink &&
                <Card.Footer>
                    <Link
                        className="blogdetails-card-link"
                        to={items.blogLink}>
                        Additional info you can find interesting : {items.blogLink}
                    </Link>
                </Card.Footer>}
            </Card>
        </React.Fragment>
    );
}

export default BlogCard;
