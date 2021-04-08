import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/blogs";
const apiEndPoint = "/blogs";

function blogUrl(id) {
    return `${apiEndPoint}/${id}`;
}

//Create single Blog object - admin rights only.
export function createBlog(blog) {
    return httpService
        .post(apiEndPoint, blog, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Retrieving all the Blog objects from DB - no token needed.
export function getBlogs() {
    return httpService
        .get(apiEndPoint);
}

//Retrieving single Blog object from the DB - no token needed.
export function getBlog(blogId) {
    return httpService
        .get(blogUrl(blogId));
}

//Updating single Blog object - admin rights only.
export function updateBlog(blog, blogId) {
    const body = {...blog};
    return httpService
        .put(blogUrl(blogId), body,{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Deleting single Blog object - admin rights only.
export function deleteBlog(blogId) {
    return httpService
        .delete(blogUrl(blogId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}
