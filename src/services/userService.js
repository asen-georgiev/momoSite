import httpService from "./httpService";
import {toast} from "react-toastify";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";
import {getCurrentUser} from "./userLoginService";

//While in working process:
// const apiEndPoint = apiUrl + "/users";

//Before deploying finished app:
const apiEndPoint = "/users";

function userUrl(userId){
    return `${apiEndPoint}/${userId}`;
}


export function registerUser(user){
    return httpService
        .post(apiEndPoint,user)
        .then(response => {
            if (response.data) {
                localStorage.setItem("user", response.data)
            }
            return response.data;
        })
        .catch(err => {
            toast.error(err.response.data);
            return Promise.reject(err);
        });
}


export function registerUserAdmin(user){
    return httpService
        .post(apiEndPoint,user,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function getUserAdmin(userId){
    return httpService
        .get(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function getUserUser(userId){
    return httpService
        .get(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}

export function getAllUsers(){
    return httpService
        .get(apiEndPoint,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function updateUser(user, userId){
    const body = {...user};
    return httpService
        .put(userUrl(userId), body,{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}


export function updateUserPassword(userEmail){
    const body = {...userEmail}
    return httpService
        .put(apiEndPoint+"/pass/update",body);
}




export function updateUserAdmin(user, userId){
    const body = {...user};
    return httpService
        .put(userUrl(userId), body,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function deleteUser(userId){
    return httpService
        .delete(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}


export function deleteUserAdmin(userId){
    return httpService
        .delete(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}
