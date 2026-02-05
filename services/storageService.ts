import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { env } from '@/config/env';

export const r2Client = new S3Client({
    region: 'auto',
    endpoint: env.CLOUDFLARE_R2_ENDPOINT!,
    credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
});

const BUCKET_NAME = env.CLOUDFLARE_R2_BUCKET_NAME!;

export interface UploadResult {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
}

export interface StorageFile {
    key: string;
    size: number;
    lastModified: Date;
    etag: string;
}

export const uploadFile = async (
    body: Buffer,
    options?: {
        key?: string;
        fileName?: string;
        contentType?: string;
    }
): Promise<UploadResult> => {
    try {
        const fileName = options?.fileName || `file-${Date.now()}`;
        const contentType = options?.contentType || 'application/octet-stream';
        const fileKey = options?.key || `uploads/${Date.now()}-${fileName}`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
                Body: body,
                ContentType: contentType,
            })
        );

        const publicUrl = `${env.CLOUDFLARE_R2_PUBLIC_URL}/${fileKey}`;

        return {
            success: true,
            url: publicUrl,
            key: fileKey,
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
};

export const getFile = async (key: string): Promise<Buffer | null> => {
    try {
        const result = await r2Client.send(
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            })
        );

        if (result.Body) {
            return Buffer.from(result.Body as any);
        }

        return null;
    } catch (error) {
        console.error('Get file error:', error);
        return null;
    }
};

export const deleteFile = async (key: string): Promise<boolean> => {
    try {
        await r2Client.send(
            new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            })
        );
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
};

export const listFiles = async (prefix = ''): Promise<StorageFile[]> => {
    try {
        const result = await r2Client.send(
            new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: prefix,
            })
        );

        return (
            result.Contents?.map((obj) => ({
                key: obj.Key!,
                size: obj.Size!,
                lastModified: obj.LastModified!,
                etag: obj.ETag!,
            })) || []
        );
    } catch (error) {
        console.error('List files error:', error);
        return [];
    }
};
