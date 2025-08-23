import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  
});
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

export class R2Service {
  /**
   * Upload a file to R2
   */
  static async uploadFile(
    file: File,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const key = this.generateFileKey(file.name);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        Metadata: metadata,
      });
      await r2Client.send(command);
      // Return the public URL or R2 URL
      const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
        ? `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
        : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${BUCKET_NAME}/${key}`;
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file to R2:", error);
      throw new Error("Failed to upload file");
    }
  }
  /**
   * Generate a presigned URL for temporary access
   */
  static async getPresignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new Error("Failed to generate presigned URL");
    }
  }
  /**
   * Generate a presigned URL for uploading a file directly to R2
   */
  static async getUploadPresignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<{ url: string; key: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });
      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
      return { url: signedUrl, key };
    } catch (error) {
      console.error("Error generating upload presigned URL:", error);
      throw new Error("Failed to generate upload presigned URL");
    }
  }
  /**
   * Delete a file from R2
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      await r2Client.send(command);
    } catch (error) {
      console.error("Error deleting file from R2:", error);
      throw new Error("Failed to delete file");
    }
  }
  /**
   * Generate a unique file key
   */
  static generateFileKey(originalName: string, folder?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    const baseName = originalName.split(".").slice(0, -1).join(".");
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const key = `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
    return folder ? `${folder}/${key}` : key;
  }
}
export { r2Client };