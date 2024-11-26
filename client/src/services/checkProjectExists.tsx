import axiosInstance from "./api";
import { API_URLS } from "./apiUrls";

export async function checkProjectExists(projectID) {
    try {
        const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/exist/${projectID}`);
        
        if (response.data.is_exist) {
            return 200;
        } else {
            return 404;
        }
 
    } catch (error) {
        return error.response.status;
    }
}
