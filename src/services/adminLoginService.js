import httpService from "./httpService";
import {toast} from "react-toastify";
import {apiUrl} from "../config.json";

const apiEndPoint = apiUrl+"/adminauthent";

//Fetching frontend admin data (email and password) to the server
//Taking the response token and saving it in the session storage(Login after every browser closing required);
export function adminLogin(data){
    return httpService
        .post(apiEndPoint,data)
        .then(response =>{
            if(response.data){
                sessionStorage.setItem("admin",response.data);
            }
            return response.data;
        })
        .catch(err =>{
            toast.error(err.response.data);
            return Promise.reject(err);
        });
}

//Function for logging out the Admin
export function adminLogout(){
    sessionStorage.removeItem("admin");
}

//Function returning the currently logged Admin (token)
export function getCurrentAdmin(){
    return sessionStorage.getItem("admin");
}
