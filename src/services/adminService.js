import httpService from "./httpService";
import {toast} from "react-toastify";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

const apiEndPoint = apiUrl + "/admins";

function adminUrl(adminId) {
    return `${apiEndPoint}/${adminId}`;
}


export function getAdmin(adminId) {
    return httpService
        .get(adminUrl(adminId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        })
}


export function getAllAdmins() {
    return httpService
        .get(apiEndPoint, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function registerAdmin(admin) {
    return httpService
        .post(apiEndPoint, admin,{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function updateAdmin(admin, adminId) {
    const body = {...admin};
    return httpService
        .put(adminUrl(adminId), body, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}


export function deleteAdmin(adminId) {
    return httpService
        .delete(adminUrl(adminId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        })
}


export function loggedAdmin(){
    return httpService
        .get(apiEndPoint+"/adm",{
            headers:{
                'x-auth-token': getCurrentAdmin()
            }
        })
}
