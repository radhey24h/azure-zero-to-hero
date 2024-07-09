import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { config } from '../config/config';

export class FileService {
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;

    constructor() {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(config.storage.connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(config.storage.containerName);
    }

    public async getFile(req: Request, res: Response, next: NextFunction) {
        try {
            const blobName = req.params.name;
            const blobClient = this.containerClient.getBlobClient(blobName);
            const downloadBlockBlobResponse = await blobClient.download();
            if (downloadBlockBlobResponse.readableStreamBody) {
                const data = await this.streamToString(downloadBlockBlobResponse.readableStreamBody);
                res.status(200).send(data);
            } else {
                res.status(404).send('File not found.');
            }
        } catch (error) {
            logging.error('FileService.getFile', error);
            next(error);
        }
    }

    public async getFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const blobs = [];
            for await (const blob of this.containerClient.listBlobsFlat()) {
                blobs.push(blob.name);
            }
            res.status(200).json(blobs);
        } catch (error) {
            logging.error('FileService.getFiles', error);
            next(error);
        }
    }

    public async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            const blobName = req.body.name;
            const content = req.body.content;
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(content, Buffer.byteLength(content));
            res.status(201).send(`File uploaded: ${blobName}`);
        } catch (error) {
            logging.error('FileService.uploadFile', error);
            next(error);
        }
    }

    public async deleteFile(req: Request, res: Response, next: NextFunction) {
        try {
            const blobName = req.body.name;
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
            res.status(200).send(`File deleted: ${blobName}`);
        } catch (error) {
            logging.error('FileService.deleteFile', error);
            next(error);
        }
    }

    private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            readableStream.on('data', (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf-8'));
            });
            readableStream.on('error', reject);
        });
    }
}
