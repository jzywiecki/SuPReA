import axiosInstance from "./api";
import { API_URLS } from "./apiUrls";

export async function checkProjectExists(projectID) {
    try {
        // Make the API call to check if the project exists
        const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`);
        
        // If the response status is 200, the project exists
        if (response.status === 200) {
            return true;
        }

        
        console.log(response.data)

        // In case of other successful status codes, handle accordingly
        return false;
    } catch (error) {
        // Check for specific error codes, e.g., 404 for not found
        if (error.response && error.response.status === 404) {
            return false; // Project not found
        }

        // Handle other errors (network issues, server errors)
        console.error("Error checking project existence:", error);
        return false;
    }
}
