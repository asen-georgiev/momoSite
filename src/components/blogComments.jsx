import React from 'react';
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {picUrl} from "../config.json";
import Col from "react-bootstrap/Col";
import "../css/blog/blogDetails.css";
import Button from "react-bootstrap/Button";

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

function BlogComments(props) {
    const {comments, user, deleteComment} = props;

    return (
        <React.Fragment>
            <Card className="blogdetails-comments-card m-4">
                {comments.map(comment => {
                    return (
                        <Card.Body className="d-flex flex-row blogdetails-comments-cardbody"
                                   key={comment._id}>
                            <Image
                                src={pictureUrl + comment.user.userPicture}
                                style={{width: '5rem', height: '5rem'}}
                                roundedCircle/>
                            <Col>
                                <Card.Title className="blogdetails-comments-cardtitle">
                                    {comment.user.userName} {comment.user.userFamily}
                                </Card.Title>
                                <Card.Text>
                                    {comment['commentText']}
                                </Card.Text>
                                {/*{comment.user._id === user._id &&*/}
                                <Button
                                    className="blogdetails-delete-button"
                                    onClick={() => deleteComment(comment)}>
                                    DELETE COMMENT
                                </Button>
                            </Col>
                        </Card.Body>
                    )
                })}
            </Card>
        </React.Fragment>
    );
}

export default BlogComments;
