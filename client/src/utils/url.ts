import { API_URLS } from "@/services/apiUrls";


export const isValidHttpUrl = (string) => {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}


export const makePictureUrl = (pictureURL) => {
    if (isValidHttpUrl(pictureURL)) {
        return pictureURL;
    }


    console.log("url", `${API_URLS.API_SERVER_URL}/resources/picture/${pictureURL}`)

    return `${API_URLS.API_SERVER_URL}/resources/picture/${pictureURL}`;
}
