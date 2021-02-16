import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import FormLabel from "react-bootstrap/FormLabel";
import ImagesUploadForm from "../../components/imagesUploadForm";
import {uploadImageAdmin} from "../../services/imgService";
import {toast} from "react-toastify";

class ImagesUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: null,
            showedFiles: [],
            isDisabled: true
        }
    }

    //Loop through event.target.files to create ObjectURL
    onChangeHandler = (event) => {

        if (this.maxSelectFiles(event)) {

            const files = [];
            for (let i = 0; i < event.target.files.length; i++) {
                files.push(URL.createObjectURL(event.target.files[i]));
            }

            this.setState({
                showedFiles: files,
                selectedFiles: event.target.files,
                isDisabled: false
            });
        }
    }

    //Loop through selected files array to append to data;
    onClickHandler = async () => {

        const data = new FormData();
        for (let i = 0; i < this.state.selectedFiles.length; i++) {
            data.append('file', this.state.selectedFiles[i])
        }

        await uploadImageAdmin(data);
        this.setState({
            isDisabled:true
        })
        toast.success('Images were successfully uploaded!');
    }


    //Function for validating the amount of images to upload simultaneously
    maxSelectFiles = (event) => {

        let files = event.target.files;
        if (files.length > 5) {
            toast.error("Only 5 images can be uploaded at a time!");
            event.target.value = null;
            return false;
        }
        return true;
    }

    adminRedirect = () => {
        this.props.history.push("/admin")
    }

    render() {
        return (
            <div>
                <Container>
                    <Card>
                        {this.state.selectedFiles !== null &&
                        <Card.Header>
                            <span>Images waiting for upload :</span>
                        </Card.Header>}
                        <Card.Body>
                            {this.state.showedFiles.map(sf => {
                                return (
                                    <CardImg
                                        key={sf}
                                        className="m-2"
                                        style={{width: '20rem'}}
                                        src={sf}/>
                                )
                            })
                            }
                            <ImagesUploadForm onChange={this.onChangeHandler}/>
                            <Row className="mt-3">
                                <Col>
                                    <Button
                                        type="button"
                                        disabled={this.state.isDisabled}
                                        onClick={this.onClickHandler}>UPLOAD</Button>
                                </Col>
                                <Col md={{span: 4, offset: 4}} className="d-flex flex-row-reverse">
                                    <Button
                                        onClick={this.adminRedirect}>
                                        BACK TO ADMIN PANEL
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default ImagesUpload;
