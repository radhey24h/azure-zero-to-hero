import express = require('express');
import { FileController } from '../controller/fileController';

export class FileRoutes {

    resultController: FileController = new FileController();

    public routes(app: express.Application): void {
        app.route('/api/getFile/:name').get(this.resultController.getFile);
        app.route('/api/getFiles').get(this.resultController.getFiles);
        app.route('/api/uploadFile').put(this.resultController.uploadFile);
        app.route('/api/deleteFile').post(this.resultController.deleteFile);
    }
}