import _ from 'lodash';

//Must calculate the starting index for the items of the current page
export function paginateFunction(items,itemsPerPage,currentPage){
    const startIndex = (currentPage-1) * itemsPerPage;

    //Using lodash _ to go to the startIndex in the items array and thake all the items we need for
    //the curent page. First converting items array to lodash _ wrapper and then using the slice and take methods
    return _(items).slice(startIndex).take(itemsPerPage).value();
}
