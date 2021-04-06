import React from 'react';
import Form from "react-bootstrap/Form";
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
