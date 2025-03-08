import axiosInstance from "@/api/axios";

export async function fetchImage(imageURL: string) {
    return axiosInstance.get(imageURL, { responseType: 'blob' });
}
