import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import FormLabel from "react-bootstrap/FormLabel";

function ImagesUploadForm(props) {
    return (
        <div>
            <Form>
                <FormLabel htmlFor="images">
                    Upload images :
                </FormLabel>
                <Form.File
                type="file"
                id="images"
                name="images"
                label="Max images to upload : 5"
                multiple
                onChange={props.onChange}/>
            </Form>
        </div>
    );
}

export default ImagesUploadForm;
