import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navigation.css'
import {Link, NavLink} from "react-router-dom";
import Row from "react-bootstrap/Row";
import NavLinkComp from "./navLinkComp";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faDiceD20, faPenNib, faUserFriends, faSignature} from "@fortawesome/free-solid-svg-icons";
import {getCurrentUser, userLogout} from "../services/userLoginService";
import jwtDecode from "jwt-decode";
import {picUrl} from "../config.json";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const navbars = [
    {_id: 1, name: "Home", to: "/", icon: faHome},
    {_id: 2, name: "Designs", to: "/designs", icon: faDiceD20},
    {_id: 3, name: "About us", to: "/about", icon: faSignature},
    {_id: 4, name: "Contacts", to: "/contacts", icon: faPenNib},
    {_id: 5, name: "Blog", to: "/blog", icon: faUserFriends},
]

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            isLogged: false
        }
    }

    async componentDidMount() {
        const jwtUser = getCurrentUser();
        if (jwtUser !== null) {
            const user = jwtDecode(jwtUser);
            this.setState({user, isLogged: true});
        } else {
            this.setState({user: null});
        }
    }

    logoutUser = () => {
        userLogout();
        this.setState({user: null, isLogged: false});
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <header>
                    <Navbar
                        className="app-navbar p-3 px-5"
                        expand="md">
                        <NavLink
                            className="pb-0"
                            to="/">
                            Momo Design
                        </NavLink>
                        <Navbar.Toggle
                            className="border-0"
                            aria-controls="navbar-toggle"/>
                        <Navbar.Collapse id="navbar-toggle">
                            <Nav className="ml-auto mr-auto">
                                <Link
                                    id="Home"
                                    to="/"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faHome}
                                        className="icon"/>
                                    <div className="d-flex justify-content-center">
                                        <span id="Home-hide">
                                            Home
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    id="Designs"
                                    to="/designs"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faDiceD20}
                                        className="icon"/>
                                    <div className="d-flex justify-content-center">
                                        <span id="Designs-hide">
                                            Designs
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    id="About"
                                    to="/about"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignature}
                                        className="icon"/>
                                    <div className="d-flex justify-content-center">
                                        <span id="About-hide">
                                            About us
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    id="Contacts"
                                    to="/contacts"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faPenNib}
                                        className="icon"/>
                                    <div className="d-flex justify-content-center">
                                        <span id="Contacts-hide">
                                            Contacts
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    id="Blog"
                                    to="/blog"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faUserFriends}
                                        className="icon"/>
                                    <div className="d-flex justify-content-center">
                                        <span id="Blog-hide">
                                            Blog
                                        </span>
                                    </div>
                                </Link>
                            </Nav>
                        </Navbar.Collapse>

                        {this.state.user === null &&
                        <Button
                            className="login-nav-button"
                            href="/userlogin">
                            Login
                        </Button>}

                        {this.state.user !== null &&
                        <Row>
                            <Nav>
                                <Link
                                    id="User"
                                    to="/userprofile">
                                    <Image src={picUrl + this.state.user.userPicture}
                                           style={{width: '3rem', height: '3rem'}}
                                           roundedCircle
                                    />
                                    <div className="d-flex justify-content-center">
                                <span id="User-hide">
                                    {this.state.user.userName}&nbsp;{this.state.user.userFamily}
                                </span>
                                    </div>
                                </Link>
                            </Nav>
                            <Button
                                className="ml-4 logout-nav-button"
                                onClick={this.logoutUser}
                                href="/">
                                Logout
                            </Button>
                        </Row>}

                    </Navbar>
                </header>
            </div>
        );
    }
}

export default Navigation;
