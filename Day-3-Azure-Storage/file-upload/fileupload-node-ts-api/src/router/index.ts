import express from 'express';
import { ApiRoutes } from './api.routes';
import { FileRoutes } from './file.routes';

export class AppRouter {
    public apiRoute: ApiRoutes = new ApiRoutes();
    public fileRoutes: FileRoutes = new FileRoutes();

    public routes(app: express.Application): void {
        this.apiRoute.routes(app);
        this.fileRoutes.routes(app);
    }
}
