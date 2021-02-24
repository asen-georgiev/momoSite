import React from 'react';
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {picUrl} from "../config.json";
import Col from "react-bootstrap/Col";

function BlogComments(props) {
    const {comments} = props;

    return (
        <React.Fragment>
            <Card>
            {comments.map(comment => {
                return (
                        <Card.Body className="d-flex flex-row" key={comment._id}>
                            <Image
                                src={picUrl + comment.user.userPicture}
                                style={{width: '5rem'}}
                                roundedCircle/>
                            <Col>
                                <Card.Title>
                                    {comment.user.userName} {comment.user.userFamily}
                                </Card.Title>
                                <Card.Text>
                                    {comment['commentText']}
                                </Card.Text>
                            </Col>
                        </Card.Body>
                )
            })}
            </Card>
        </React.Fragment>
    );
}

export default BlogComments;
