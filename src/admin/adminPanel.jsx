import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import {getCurrentAdmin,adminLogout} from "../services/adminLoginService";
import jwtDecode from "jwt-decode";


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin:[]
        }
    }

    componentDidMount() {
        const jwtAdmin = getCurrentAdmin();
        const admin = jwtDecode(jwtAdmin);
        this.setState({admin});
        console.log(admin);
    }

    render() {
        return (
            <div>
                <Container>
                    <h2>Admin panel is working!</h2>
                    <h3>Logged as: {this.state.admin.adminName}</h3>
                </Container>
            </div>
        );
    }
}

export default AdminPanel;
