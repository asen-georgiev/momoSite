import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import * as PropTypes from "prop-types";
import "../css/admin/designs/designAllList.css";

function DropDownDesigns(props) {

    const {designs, designProperty, selectedDesign, onSelectDropDown} = props;

    return (
        <Dropdown>
            <Dropdown.Toggle
            className="drd-designs-toggle">
                {selectedDesign[designProperty] || selectedDesign}
            </Dropdown.Toggle>
            <Dropdown.Menu
            className="drd-designs-menu">
                {designs.map(design =>
                    <React.Fragment key={design[designProperty]}>
                        <Dropdown.Divider/>
                        <Dropdown.Item
                            className="drd-design-item text-center"
                            onSelect={() => onSelectDropDown(design)}>
                            {design[designProperty]}
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                    </React.Fragment>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

DropDownDesigns.propTypes = {
    designs: PropTypes.array.isRequired,
    designProperty: PropTypes.string.isRequired,
    selectedDesign: PropTypes.object.isRequired,
    onSelectDropDown: PropTypes.func.isRequired
}

export default DropDownDesigns;
