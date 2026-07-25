import axios from "axios";

export type UploadResponse = {
    filename: string;
    object_name: string;
    image_url: string;
    content_type: string;
    message: string;
};

const uploadApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export async function uploadImage(
    file: File
): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await uploadApi.post<UploadResponse>(
        "/upload/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}