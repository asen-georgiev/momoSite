import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navigation.css'
import {Link, NavLink} from "react-router-dom";
import Row from "react-bootstrap/Row";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faDiceD20, faPenNib, faUserFriends, faSignature} from "@fortawesome/free-solid-svg-icons";
import {getCurrentUser, userLogout} from "../services/userLoginService";
import jwtDecode from "jwt-decode";
import {picUrl} from "../config.json";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import {getCurrentAdmin} from "../services/adminLoginService";

// const navbars = [
//     {_id: 1, name: "Home", to: "/", icon: faHome},
//     {_id: 2, name: "Designs", to: "/designs", icon: faDiceD20},
//     {_id: 3, name: "About us", to: "/about", icon: faSignature},
//     {_id: 4, name: "Contacts", to: "/contacts", icon: faPenNib},
//     {_id: 5, name: "Blog", to: "/blog", icon: faUserFriends},
// ]

const pictureUrl = process.env.REACT_APP_PICTURES_URL;

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            admin: null,
            isLogged: false
        }
    }

    async componentDidMount() {
        const jwtUser = getCurrentUser();
        const jwtAdmin = getCurrentAdmin();
        if (jwtUser !== null) {
            const user = jwtDecode(jwtUser);
            this.setState({user, isLogged: true});
        } else {
            this.setState({user: null});
        }
        if (jwtAdmin !== null) {
            const admin = jwtDecode(jwtAdmin);
            this.setState({admin, isLogged: true});
        } else {
            this.setState({admin: null});
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
                        fixed="top"
                        className="app-navbar p-3 px-5"
                        expand="md">
                        <NavLink
                            className="app-navbar-momo pb-0"
                            to="/">
                            MOMO DESIGN
                        </NavLink>
                        <Navbar.Toggle
                            className="app-navbar-toggle border-0"
                            aria-controls="navbar-toggle"/>
                        <Navbar.Collapse id="navbar-toggle">
                            <Nav className="ml-auto mr-auto">
                                <a
                                    id="Home"
                                    href="/"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faHome}
                                        className="icon"/>

                                    <span className="Home-show">
                                            HOME
                                        </span>

                                    <div className="d-flex justify-content-center">
                                        <span id="Home-hide" className="Home-hide">
                                            HOME
                                        </span>
                                    </div>
                                </a>
                                <a
                                    id="Designs"
                                    href="/designs"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faDiceD20}
                                        className="icon"/>

                                    <span className="Designs-show">
                                            DESIGNS
                                        </span>

                                    <div className="d-flex justify-content-center">
                                        <span id="Designs-hide" className="Designs-hide">
                                            DESIGNS
                                        </span>
                                    </div>
                                </a>
                                <a
                                    id="Bio"
                                    href="/biography"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignature}
                                        className="icon"/>

                                    <span className="Bio-show">
                                            ABOUT US
                                        </span>

                                    <div className="d-flex justify-content-center">
                                        <span id="Bio-hide" className="Bio-hide">
                                            ABOUT US
                                        </span>
                                    </div>
                                </a>
                                <a
                                    id="Contacts"
                                    href="/contacts"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faPenNib}
                                        className="icon"/>

                                    <span className="Contacts-show">
                                            CONTACTS
                                        </span>

                                    <div className="d-flex justify-content-center">
                                        <span id="Contacts-hide" className="Contacts-hide">
                                            CONTACTS
                                        </span>
                                    </div>
                                </a>
                                <a
                                    id="Blog"
                                    href="/blog"
                                    className="app-navbar-link"
                                >
                                    <FontAwesomeIcon
                                        icon={faUserFriends}
                                        className="icon"/>

                                    <span className="Blog-show">
                                            BLOG
                                        </span>

                                    <div className="d-flex justify-content-center">
                                        <span id="Blog-hide" className="Blog-hide">
                                            BLOG
                                        </span>
                                    </div>
                                </a>
                            </Nav>
                        </Navbar.Collapse>

                        {this.state.user === null && this.state.admin === null &&
                        <Button
                            className="login-nav-button"
                            href="/userlogin">
                            LOGIN
                        </Button>}

                        {this.state.user !== null &&
                        <Row>
                            <Nav>
                                <Link
                                    id="User"
                                    to="/userprofile">
                                    <Image src={pictureUrl + this.state.user.userPicture}
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
                                LOGOUT
                            </Button>
                        </Row>}

                    </Navbar>
                </header>
            </div>
        );
    }
}

export default Navigation;
