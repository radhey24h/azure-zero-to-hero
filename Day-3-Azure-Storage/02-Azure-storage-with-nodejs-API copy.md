Sure! Here's an example of how you can implement a complete Node.js TypeScript API to interact with Azure Storage for uploading, downloading, and deleting files:

```typescript
import { BlobServiceClient } from '@azure/storage-blob';
import express from 'express';
import multer from 'multer';

const app = express();
const port = 3000;

// Create a BlobServiceClient instance
const connectionString = '<your-azure-storage-connection-string>';
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Create a container client
const containerName = '<your-container-name>';
const containerClient = blobServiceClient.getContainerClient(containerName);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload a file to Azure Storage
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(file.path);

    res.send('File uploaded successfully');
});

// Download a file from Azure Storage
app.get('/download/:blobName', async (req, res) => {
    const blobName = req.params.blobName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const downloadResponse = await blockBlobClient.download();
    const content = await streamToString(downloadResponse.readableStreamBody);

    res.send(content);
});

// Delete a file from Azure Storage
app.delete('/delete/:blobName', async (req, res) => {
    const blobName = req.params.blobName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();

    res.send('File deleted successfully');
});

// Helper function to convert a readable stream to a string
async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data.toString());
        });
        readableStream.on('end', () => {
            resolve(chunks.join(''));
        });
        readableStream.on('error', reject);
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

Remember to replace `<your-azure-storage-connection-string>` with your actual Azure Storage connection string, and `<your-container-name>` with the name of your container.

I hope this helps! Let me know if you have any further questions.