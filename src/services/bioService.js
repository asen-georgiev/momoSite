import httpService from "./httpService";
import {getCurrentAdmin} from "./adminLoginService";
import {apiUrl} from "../config.json";

// const apiEndPoint = apiUrl + "/bios";
const apiEndPoint = "/bios";

function bioUrl(id) {
    return `${apiEndPoint}/${id}`;
}

//Creating single Biography object - admin rights only.
export function createBio(bio) {
    return httpService
        .post(apiEndPoint, bio, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Retieving all the Biogaphy objects from DB - no token needed.
export function getBios() {
    return httpService
        .get(apiEndPoint);
}

//Retrieving single Biography object from DB - no token needed.
export function getBio(bioId) {
    return httpService
        .get(bioUrl(bioId));
}

//Updating single Biography object - admin rights only.
export function updateBio(bio, bioId) {
    const body = {...bio};
    return httpService
        .put(bioUrl(bioId), body, {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}

//Deleting single Biography object - admin rights only.
export function deleteBio(bioId) {
    return httpService
        .delete(bioUrl(bioId), {
            headers: {
                'x-auth-token': getCurrentAdmin()
            }
        });
}
