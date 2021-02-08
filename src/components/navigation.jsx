import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navigation.css'
import {NavLink} from "react-router-dom";
import NavLinkComp from "./navLinkComp";
import {faHome, faDiceD20, faPenNib,faUserFriends,faSignature} from "@fortawesome/free-solid-svg-icons";

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
                                <NavLinkComp items={navbars} className="app-navbar-link"/>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
            </div>
        );
    }
}

export default Navigation;
