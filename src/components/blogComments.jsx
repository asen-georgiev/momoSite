import React from 'react';
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {picUrl} from "../config.json";
import Col from "react-bootstrap/Col";

function BlogComments(props) {
    const {comments} = props;

    return (
        <React.Fragment>
            {comments.map(comment => {
                return (
                    <Card key={comment._id}>
                        <Card.Body className="d-flex flex-row">
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
                    </Card>
                )
            })}
        </React.Fragment>
    );
}

export default BlogComments;
