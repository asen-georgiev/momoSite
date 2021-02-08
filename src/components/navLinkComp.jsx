import React from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


function NavLinkComp(props) {
    const {items, className} = props;
    return (
        items.map(item => {
            return (
                <NavLink
                    key={item._id}
                    className={className}
                    to={item.to}
                >
                    <FontAwesomeIcon
                        icon={item.icon}
                        className="icon"
                    />
                    <span>
                        {item.name}
                    </span>
                </NavLink>
            )
        })
    );
}

export default NavLinkComp;
