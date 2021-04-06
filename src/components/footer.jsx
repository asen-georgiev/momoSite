import React, {Component} from 'react';
import {Navbar} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";
import {faPhoneSquare} from "@fortawesome/free-solid-svg-icons/faPhoneSquare";
import {faMailBulk} from "@fortawesome/free-solid-svg-icons/faMailBulk";
import {faFacebookSquare} from "@fortawesome/free-brands-svg-icons/faFacebookSquare";
import {faInstagramSquare} from "@fortawesome/free-brands-svg-icons/faInstagramSquare";
import {faTwitterSquare} from "@fortawesome/free-brands-svg-icons/faTwitterSquare";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons/faLinkedin";
import "../css/footer.css";

class Footer extends Component {
    render() {
        return (
            <div>
                <footer>
                    <Navbar className="p-4 px-5 w-100 app-footer d-flex flex-column" expand="lg">
                        <span className="app-footer-span">
                            FOLLOW US ON THE SOCIAL MEDIA :
                        </span>
                        {/*<Navbar.Toggle aria-controls="navbar-toggle"/>*/}
                        {/*<Navbar.Collapse id="navbar-toggle">*/}
                            <Nav className="ml-auto mr-auto mt-1">
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faPhoneSquare}
                                        className="icon mx-2"/>
                                    <span>+1234567890</span>
                                </Link>
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faMailBulk}
                                        className="icon mx-2"/>
                                    <span>momodesign@gmail.com</span>
                                </Link>
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faFacebookSquare}
                                        className="icon mx-2"/>
                                    <span>FACEBOOK</span>
                                </Link>
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faInstagramSquare}
                                        className="icon mx-2"/>
                                    <span>INSTAGRAM</span>
                                </Link>
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faTwitterSquare}
                                        className="icon mx-2"/>
                                    <span>TWITTER</span>
                                </Link>
                                <Link
                                    className="app-footer-link">
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className="icon mx-2"/>
                                    <span>LINKEDIN</span>
                                </Link>
                            </Nav>
                        {/*</Navbar.Collapse>*/}
                        <span className="app-footer-span-site">
                            This website is developed by : <a
                            href="https://www.facebook.com/flurvian.sea.3/"
                            className="app-footer-span-site-link">
                            FlurvianSea
                        </a>
                        </span>
                    </Navbar>
                </footer>
            </div>
        );
    }
}

export default Footer;
