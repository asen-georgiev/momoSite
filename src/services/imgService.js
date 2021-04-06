import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/images";
const apiEndPoint = "/images";


export function uploadImageAdmin(data){
    return httpService
        .post(apiEndPoint, data, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        })
        .then(response => {
            console.log(response.statusText)
        });
}


export function uploadImageUser(data){
    return httpService
        .post(apiEndPoint,data);
}



export function getImages(){
    return httpService
        .get(apiEndPoint)
}
