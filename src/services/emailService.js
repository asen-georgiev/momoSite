import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

const apiEndPoint = apiUrl + "/emails";

function emailUrl(id){
    return `${apiEndPoint}/${id}`;
}


export function sendEmail(email){
    return httpService
        .post(apiEndPoint, email)
        .then(res => console.log(res.data))
        .catch(error => console.log(error))
}
