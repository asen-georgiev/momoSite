import React from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


function NavLinkComp(props) {
    const {items, className} = props;
    return (
        <div>
            {items.map(item => {
            return (
                <Link
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
                </Link>
            )
        })}
        </div>

    );
};

export default NavLinkComp;
