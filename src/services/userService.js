import httpService from "./httpService";
import {toast} from "react-toastify";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";
import {getCurrentUser} from "./userLoginService";

const apiEndPoint = apiUrl + "/users";

function userUrl(userId){
    return `${apiEndPoint}/${userId}`;
}


export function registerUser(user){
    return httpService
        .post(apiEndPoint,user);
}


export function registerUserAdmin(user){
    return httpService
        .post(apiEndPoint,user,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function getUser(userId){
    return httpService
        .get(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentAdmin()
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
