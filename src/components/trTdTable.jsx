import React from 'react';
import {Link} from "react-router-dom";
import * as PropTypes from "prop-types";
import "../css/admin/adminPanel.css";

function TrTdTable(props) {

    const {name, link1Name, link2Name, link1To, link2To} = props;
    return (

        <tr>
            <td>{name}</td>
            <td>
                <Link
                    className="panel-link"
                    to={link1To}>
                    {link1Name}
                </Link>
            </td>
            <td>
                <Link
                    className="panel-link"
                    to={link2To}>
                    {link2Name}
                </Link>
            </td>
        </tr>

    );
}

TrTdTable.propTypes = {
    name: PropTypes.string.isRequired,
    link1Name: PropTypes.string.isRequired,
    link1To: PropTypes.string.isRequired,
    link2Name: PropTypes.string.isRequired,
    link2To: PropTypes.string.isRequired
}


export default TrTdTable;
