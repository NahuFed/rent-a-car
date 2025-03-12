import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));
jest.mock('fs', () => ({
  createReadStream: jest.fn(),
  promises: {
    readFile: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe('S3Service', () => {
  let service: S3Service;
  let s3ClientMock: jest.Mocked<S3Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
    s3ClientMock = new S3Client({}) as jest.Mocked<S3Client>;
    service['s3'] = s3ClientMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file to S3', async () => {
      const filePath = 'path/to/file.txt';
      const key = 'file.txt';
      const contentType = 'text/plain';
      const folder = 'documents';

      const fileStream = {} as fs.ReadStream;
      (fs.createReadStream as jest.Mock).mockReturnValue(fileStream);

      const sendMock = jest.fn().mockResolvedValue({});
      s3ClientMock.send = sendMock;

      const result = await service.uploadFile(filePath, key, contentType, folder);

      expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(result).toBe(`http://localhost:9000/my-local-bucket/${folder}/${key}`);
    });
  });

  describe('getPresignedUrl', () => {
    it('should return a presigned URL', async () => {
      const key = 'file.txt';
      const url = 'http://localhost:9000/my-local-bucket/file.txt';

      const getSignedUrlMock = jest.fn().mockResolvedValue(url);
      (getSignedUrl as jest.Mock).mockImplementation(getSignedUrlMock);

      const result = await service.getPresignedUrl(key);

      expect(getSignedUrlMock).toHaveBeenCalledWith(expect.any(S3Client), expect.any(GetObjectCommand), { expiresIn: 3600 });
      expect(result).toBe(url);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from S3', async () => {
      const key = 'file.txt';

      const sendMock = jest.fn().mockResolvedValue({});
      s3ClientMock.send = sendMock;

      await service.deleteFile(key);

      expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    });
  });

  describe('getFiles', () => {
    it('should list files in S3 bucket', async () => {
      const files = { Contents: [{ Key: 'file.txt' }] };

      const sendMock = jest.fn().mockResolvedValue(files);
      s3ClientMock.send = sendMock;

      const result = await service.getFiles();

      expect(sendMock).toHaveBeenCalledWith(expect.any(ListObjectsCommand));
      expect(result).toBe(files);
    });
  });
});
