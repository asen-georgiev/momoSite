import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

const apiEndPoint = apiUrl + "/bios";

function bioUrl(id) {
    return `${apiEndPoint}/${id}`;
}

//Create single Bio object
export function createBio(bio) {
    return httpService
        .post(apiEndPoint, bio, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Get all Bio object from DB
export function getBios() {
    return httpService
        .get(apiEndPoint);
}

//Get single Bio object by ID
export function getBio(bioId) {
    return httpService
        .get(bioUrl(bioId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Updating single Bio object
export function updateBio(bio, bioId) {
    const body = {...bio};
    return httpService
        .put(bioUrl(bioId), body, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Deleting single Bio object
export function deleteBio(bioId) {
    return httpService
        .delete(bioUrl(bioId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}
