import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { FileService } from '../services/file.service';

export class FileController {

    public getFile(req: Request, res: Response, next: NextFunction) {

        logging.info('getresults:: results');

        let fileService = new FileService();
        fileService.getFile(req, res, next);
    }
    public getFiles(req: Request, res: Response, next: NextFunction) {

        logging.info('getresults :: results');

        let fileService = new FileService();
        fileService.getFiles(req, res, next);
    }
   
    public uploadFile(req: Request, res: Response, next: NextFunction) {

        logging.info('updateresults :: results');

        let fileService = new FileService();
        fileService.uploadFile(req, res, next);
    }
    public deleteFile(req: Request, res: Response, next: NextFunction) {

        logging.info('deleteresults :: results');

        let fileService = new FileService();
        fileService.deleteFile(req, res, next);
    }
}