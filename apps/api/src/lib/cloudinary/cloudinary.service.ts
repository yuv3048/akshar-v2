import type { Bindings } from "../../types";

const createSignature = async (
    params: Record<string, string>,
    apiSecret: string,
)=>{
    const sortedParams = Object.entries(params)
        .sort(([a],[b])=> a.localeCompare(b))
        .map(([key, value])=> `${key}=${value}`)
        .join("&");

    const stringToSign = `${sortedParams}${apiSecret}`;

    const data = new TextEncoder().encode(stringToSign);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data,
    )

    return Array.from(new Uint8Array(hashBuffer))
        .map((byte)=> byte.toString(16).padStart(2,"0"))
        .join("");
}

type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
}

export const uploadToCloudinary = async(
    env: Bindings,
    file: File,
    folder: string,
): Promise<CloudinaryUploadResult>=>{
    const timestamp = Math.floor(Date.now()/1000);

    const params ={
        folder, 
        timestamp: timestamp.toString(),
    };

    const signature = await createSignature(
        params,
        env.CLOUDINARY_API_SECRET,
    );

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", env.CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folder);
    formData.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        },
    );

    if(!response.ok){
        throw new Error("Cloudinary upload failed");
    }

    return (await response.json()) as CloudinaryUploadResult;
}