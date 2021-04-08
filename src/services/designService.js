import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/designs";
const apiEndPoint = "/designs";

function designUrl(id){
    return `${apiEndPoint}/${id}`;
}

//Creating single Design object - admin rights only.
export function createDesign(design){
    return httpService
        .post(apiEndPoint,design,{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Retrieve all the Design objects from DB - no token needed.
export function getDesigns(){
    return httpService
        .get(apiEndPoint);
}

//Retireving single Design object - no token needed.
export function getDesign(designId){
    return httpService
        .get(designUrl(designId));
}

//Updating single Design object - admin rights only.
export function updateDesign(design,designId){
    const body = {...design}
    return httpService
        .put(designUrl(designId),body,{
            headers: {
                'x-auth-token':getCurrentAdmin()
            }
        });
}

//Deleting single Design object - admin rights only.
export function deleteDesign(designId){
    return httpService
        .delete(designUrl(designId),{
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}
