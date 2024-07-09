import express = require('express');
import { FileController } from '../controller/fileController';

export class FileRoutes {

    fileController: FileController = new FileController();

    public routes(app: express.Application): void {
        app.route('/api/getFile/:name').get(this.fileController.getFile.bind(this.fileController));
        app.route('/api/getFiles').get(this.fileController.getFiles.bind(this.fileController));
        app.route('/api/uploadFile').put(this.fileController.uploadFile.bind(this.fileController));
        app.route('/api/deleteFile').delete(this.fileController.deleteFile.bind(this.fileController));
    }
}