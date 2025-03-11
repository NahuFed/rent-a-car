import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, CreateBucketCommand, GetObjectCommand, DeleteObjectCommand,ListObjectsCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName = 'my-local-bucket';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_REGION || 'us-east-1', 
      endpoint: 'http://localhost:9000', 
      credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID || 'admin', 
        secretAccessKey: process.env.S3_SECRET_KEY || 'password', 
      },
      forcePathStyle: true, 
    });
    this.initializeBucket();
  }

  async initializeBucket() {
    try {
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      
    } catch (error) {
      if (error.name !== 'BucketAlreadyOwnedByYou' && error.name !== 'BucketAlreadyExists') {
        throw error;
      }
    }
  }

  async uploadFile(filePath: string, key: string, contentType: string, folder: string) {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${folder}/${key}`,
      Body: fileStream,
      ContentType: contentType,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    return `http://localhost:9000/${this.bucketName}/${folder}/${key}`;
  }

  async getPresignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.s3, command, { expiresIn });
  }

  async deleteFile(key: string) {    
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };
    await this.s3.send(new DeleteObjectCommand(deleteParams));
  }

  async getFiles() {
    const listParams = {
      Bucket: this.bucketName,
    };
    return await this.s3.send(new ListObjectsCommand(listParams));
  }
}
