import httpService from "./httpService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/userauthent";
const apiEndPoint = "/userauthent";

//Fetching User frontend data to the sever
//Taking the response token and storing it in localStorage so the user stayed always logged till logout
export function userLogin(data) {
    return httpService
        .post(apiEndPoint, data)
        .then(response => {
        if (response.data) {
            localStorage.setItem("user", response.data)
        }
        return response.data;
    })
        .catch(err => {
            // toast.error(err.response.data);
            return Promise.reject(err);
        });
}

//Function for logging out the User
export function userLogout() {
    localStorage.removeItem("user");
}

//Function returning the currently logged User (token)
export function getCurrentUser() {
    return localStorage.getItem("user");
}
