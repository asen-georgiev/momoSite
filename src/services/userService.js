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

//Register single User object in DB - no token needed.
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

//Register single User object in DB - admin rights only.
export function registerUserAdmin(user){
    return httpService
        .post(apiEndPoint,user,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Retrieving single User object from DB - admin rights only.
export function getUserAdmin(userId){
    return httpService
        .get(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


//Retrieving single User object from DB - user rights only.
export function getUserUser(userId){
    return httpService
        .get(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}


//Retrieving all the User objects from DB - admin rights only.
export function getAllUsers(){
    return httpService
        .get(apiEndPoint,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


//Updating single User object - user rights only.
export function updateUser(user, userId){
    const body = {...user};
    return httpService
        .put(userUrl(userId), body,{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}


//Updating user password with automatically generated password in case of forgetting.
export function updateUserPassword(userEmail){
    const body = {...userEmail}
    return httpService
        .put(apiEndPoint+"/pass/update",body);
}


//Updating single User object - admin rights only.
export function updateUserAdmin(user, userId){
    const body = {...user};
    return httpService
        .put(userUrl(userId), body,{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}


//Deleting single User object - user rights only.
export function deleteUser(userId){
    return httpService
        .delete(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentUser()
            }
        });
}


//Deleting single User object admin rights only.
export function deleteUserAdmin(userId){
    return httpService
        .delete(userUrl(userId),{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        });
}
