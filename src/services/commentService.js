import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {getCurrentUser} from "./userLoginService";
import {apiUrl} from "../config.json";

const apiEndPoint = apiUrl + "/comments";
const apiBlogEndPoint = apiUrl + "/comments/by-blog";
const apiUserEndPoint = apiUrl + "/comments/by-user";

function commentUrl(id) {
    return `${apiEndPoint}/${id}`;
}

function byBlogUrl(id) {
    return `${apiBlogEndPoint}/${id}`;
}

function byUserUrl(id) {
    return `${apiUserEndPoint}/${id}`;
}


//Create single Comment
export function createComment(comment) {
    return httpService
        .post(apiEndPoint, comment, {
            headers: {
                'x-auth-token': getCurrentUser()
            }
        });
}

//Get all Comments (For Admin only!)
export function getComments() {
    return httpService
        .get(apiEndPoint, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Get single Comment
export function getComment(commentId) {
    return httpService
        .get(commentUrl(commentId));
}

//Get all Comments for a Blog by ID
export function getCommentsByBlog(blogId) {
    return httpService
        .get(byBlogUrl(blogId));
}

//Get all Comments for a User by ID (For auth user only!)
export function getCommentsByUser(userId) {
    return httpService
        .get(byUserUrl(userId), {
            headers: {
                'x-auth-token': getCurrentUser()
            }
        })
}
