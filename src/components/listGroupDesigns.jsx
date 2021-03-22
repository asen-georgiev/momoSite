import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/designs/designPage.css";
import * as PropTypes from "prop-types";

function ListGroupDesigns(props) {

    const {designs, onDesignSelect, selectedDesign} = props;
    return (
        <Row>
            {designs.map(design => {
                return (
                    <Col
                        key={design.designType}
                        className={design.designType === selectedDesign.designType
                            ? "listgroup-designs-col-active p-5 d-flex flex-column text-center"
                            : "listgroup-designs-col p-5 d-flex flex-column text-center"}>
                       <span
                           className={design.designType === selectedDesign.designType
                               ? "listgroup-designs-span-active"
                               : "listgroup-designs-span"}
                           onClick={() => onDesignSelect(design)}>
                           {design.designType}
                       </span>
                    </Col>
                )
            })}
        </Row>
    );
}

ListGroupDesigns.propTypes = {
    designs: PropTypes.array.isRequired,
    selectedDesign: PropTypes.object.isRequired,
    onDesignSelect: PropTypes.func.isRequired,
}

export default ListGroupDesigns;
