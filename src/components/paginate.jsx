import React from 'react';
import _ from 'lodash';
import Pagination from 'react-bootstrap/Pagination';
import PropTypes from 'prop-types';
import "../css/paginate.css";


function Paginate(props) {
    //Destructuring the props object
    const {itemsCount, itemsPerPage, currentPage, onPageChange, className} = props;

    //We receive pagesCount when w divide itemsCount on how many items we want to have on each page.
    //Math.ceil is converting the result number to int. because we can have double or float like result
    const pagesCount = Math.ceil(itemsCount / itemsPerPage);

    if (pagesCount === 1) return null;//If we have only one page there is no point to show 1 page;

    //We are creating an array with the numbers from 1 to pagesCount, we are iterating through that array
    //and on each number we are adding the Pagination item.
    const pages = _.range(1, pagesCount + 1);
    //It is pagesCount+1 because the start index is INCLUDED and the last is EXCLUDED

    let isDisabledPrev = false;
    if (currentPage === 1) {
        isDisabledPrev = true;
    }

    let isDisabledNext = false;
    if (currentPage === pagesCount) {
        isDisabledNext = true;
    }

    return (
        <Pagination className={className}>
            <Pagination.Prev disabled={isDisabledPrev} onClick={() => onPageChange(currentPage - 1)}/>
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    className={page === currentPage ? 'page-item active' : 'page-item'}
                    onClick={() => onPageChange(page)}>
                    {page}
                </Pagination.Item>)}
            <Pagination.Next disabled={isDisabledNext} onClick={() => onPageChange(currentPage + 1)}/>
        </Pagination>
    );
}

Paginate.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Paginate;
