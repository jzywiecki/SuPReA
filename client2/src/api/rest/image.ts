import axiosInstance from "@/api/axios";

export async function fetchImage(imageURL: string) {
    return await axiosInstance.get(imageURL, { responseType: 'blob' });
}
