import axiosInstance from "@/api/axios";
import API_URLS from "../urls";

export async function fetchCreateProject(name: string, forWho: string, doingWhat: string, additionalInfo: string, ownerId: string, textAiModel: string, imageAiModel: string) {
    const request = {
        name: name,
        for_who: forWho,
        doing_what: doingWhat,
        additional_info: additionalInfo,
        owner_id: ownerId,
        text_ai_model: textAiModel,
        image_ai_model: imageAiModel,
    };

    const response = await axiosInstance.post(`${API_URLS.API_SERVER_URL}/projects/create`, request, {
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return response.data;
}

export async function fetchCreateEmptyProject(name: string, ownerId: string) {
    const request = {
        name: name,
        owner_id: ownerId,
    };

    const response = await axiosInstance.post(`${API_URLS.API_SERVER_URL}/projects/create-empty`, request, {
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return response.data;
}
