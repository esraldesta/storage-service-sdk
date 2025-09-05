import axios, { type AxiosInstance } from "axios";
import * as fs from "fs";
import type { ApiKeyConfig, FileUpdateResponse, PresignedUrlResponse, PresignFileDto } from "./types.js";
import { BASE_URL } from "./constants.js";

export class StorageClient {
    private axios: AxiosInstance;

    constructor(private config: ApiKeyConfig) {
        this.axios = axios.create({
            baseURL: BASE_URL,

            headers: {
                Authorization: `Bearer ${this.config.apiKey}`,
            },
        });
    }

    /** Request presigned URL for uploading */
    async getPresignedUrl(dto: PresignFileDto): Promise<PresignedUrlResponse> {
        const { data } = await this.axios.post<PresignedUrlResponse>("", dto);
        return data;
    }

    /** Stream (download) a file by ID */
    async downloadFile(fileId: string, destination: string): Promise<void> {
        const response = await this.axios.get("/" + fileId, {
            responseType: "stream",
        });

        const writer = fs.createWriteStream(destination);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }

    /** Mark file as uploaded (after success upload to S3) */
    async markAsUploaded(fileId: string): Promise<FileUpdateResponse> {
        const { data } = await this.axios.patch<FileUpdateResponse>("/" + fileId);
        return data;
    }

    /** Delete a file */
    async deleteFile(fileId: string): Promise<FileUpdateResponse> {
        const { data } = await this.axios.delete<FileUpdateResponse>(
            "/" + fileId,
        );
        return data;
    }
}
