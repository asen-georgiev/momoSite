import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/emails";
const apiEndPoint = "/emails";

function emailUrl(id){
    return `${apiEndPoint}/${id}`;
}

//Creating email object, sendind through SendGrid - no token needed.
export function sendEmail(email){
    return httpService
        .post(apiEndPoint, email)
        .then(res => console.log(res.data))
        .catch(error => console.log(error))
}

//Retrieving all the Email objects from DB - admin rights only.
export function getAllEmails(){
    return httpService
        .get(apiEndPoint, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Deleting single Email object from DB - admin rights only.
export function deleteEmail(emailId){
    return httpService
        .delete(emailUrl(emailId),{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}
