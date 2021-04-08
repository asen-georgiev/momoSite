import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/images";
const apiEndPoint = "/images";

//Uploading Image(s) to the gallery in the backend API - admin rights only
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

//Uploading Image to the gallery in the backend API - no token needed.
//Because the case of User registration process.
export function uploadImageUser(data){
    return httpService
        .post(apiEndPoint,data);
}


//Retrieving all Images from gallery - admin rights only.
export function getImages(){
    return httpService
        .get(apiEndPoint,{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        })
}
