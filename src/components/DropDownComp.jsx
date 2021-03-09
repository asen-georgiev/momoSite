import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import * as PropTypes from "prop-types";
import "../css/admin/comments/commentAllList.css";

function DropDownComp(props) {

    const {items, valueProperty,textProperty,selectedItem,onSelectDropDown} = props;

    return (
        <Dropdown>
            <Dropdown.Toggle
            className="drd-toggle">
                {selectedItem['userEmail'] || selectedItem}
            </Dropdown.Toggle>
            <Dropdown.Menu
            className="drd-menu">
                {items.map(item =>
                <React.Fragment key={item.user[valueProperty]}>
                    <Dropdown.Divider/>
                    <Dropdown.Item
                        className="drd-item text-center"
                    onSelect={() => onSelectDropDown(item.user)}>
                        {item.user[textProperty]}
                    </Dropdown.Item>
                    <Dropdown.Divider/>
                </React.Fragment>
                    )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

DropDownComp.propTypes = {
    items: PropTypes.array.isRequired,
    valueProperty: PropTypes.string.isRequired,
    textProperty: PropTypes.string.isRequired,
    selectedItem: PropTypes.object.isRequired,
    onSelectDropDown: PropTypes.func.isRequired,
}

export default DropDownComp;
