import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {getCurrentUser} from "./userLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/comments";
// const apiBlogEndPoint = apiUrl + "/comments/by-blog";
// const apiUserEndPoint = apiUrl + "/comments/by-user";

const apiEndPoint = "/comments";
const apiBlogEndPoint = "/comments/by-blog";
const apiUserEndPoint = "/comments/by-user";

function commentUrl(id) {
    return `${apiEndPoint}/${id}`;
}

function byBlogUrl(id) {
    return `${apiBlogEndPoint}/${id}`;
}

function byUserUrl(id) {
    return `${apiUserEndPoint}/${id}`;
}


//Creating single Comment object - user rights only.
export function createComment(comment) {
    return httpService
        .post(apiEndPoint, comment, {
            headers: {
                'x-auth-token': getCurrentUser()
            }
        });
}

//Retrieving all Comment objects from DB - admin rights only.
export function getComments() {
    return httpService
        .get(apiEndPoint, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Retrieving single Comment object
export function getComment(commentId) {
    return httpService
        .get(commentUrl(commentId));
}

//Retrieving all the Comment objects by Blog ID - no token needed.
export function getCommentsByBlog(blogId) {
    return httpService
        .get(byBlogUrl(blogId));
}

//Retrieving all the Comment objects by User ID - user rights only.
export function getCommentsByUser(userId) {
    return httpService
        .get(byUserUrl(userId), {
            headers: {
                'x-auth-token': getCurrentUser()
            }
        })
}

//Deleting single Comment object - admin rights only.
export function deleteComment(commentId){
    return httpService
        .delete(commentUrl(commentId),{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        })
}
