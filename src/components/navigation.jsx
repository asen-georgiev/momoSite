import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import'../css/navigation.css'
import {NavLink} from "react-bootstrap";

class Navigation extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <header>
                    <Navbar className="app-navbar p-3 px-5" expand="xl">
                        <NavLink className="pb-0" to="/">Momo Design</NavLink>
                        <Navbar.Toggle className="border-0" aria-controls="navbar-toggle"/>
                        <Navbar.Collapse id="navbar-toggle">
                            <Nav className="ml-auto pr-2">
                                <NavLink className="app-navbar-link" to="/">
                                    <span> One</span>
                                </NavLink>
                                <NavLink className="app-navbar-link" to="/news">
                                    <span> Two</span>
                                </NavLink>
                                <NavLink className="app-navbar-link" to="/clubbio">
                                    <span> Three</span>
                                </NavLink>
                                <NavLink  className="app-navbar-link" to="/schedule">
                                    <span> Four</span>
                                </NavLink>
                                <NavLink  className="app-navbar-link" to="/events">
                                    <span> Five</span>
                                </NavLink>
                                <NavLink  className="app-navbar-link" to="/contacts">
                                    <span> Six</span>
                                </NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
            </div>
        );
    }
}

export default Navigation;
