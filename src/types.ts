export interface PresignFileDto {
    fileName: string;
    contentType: string;
    size: number;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    key: string;
}


export interface FileUpdateResponse {
    id: string;
}


export interface ApiKeyConfig {
    apiKey: string;  // sk_live_xxx
}


