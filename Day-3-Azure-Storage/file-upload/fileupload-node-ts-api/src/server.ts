import * as http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { config } from './config/config'; 
import logging from './config/logging';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
    logging.info('........................');
    logging.info('Starting server...');
    logging.info('........................');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    logging.info('........................');
    logging.info('logging and configuring server...');
    logging.info('........................');
    app.use(loggingHandler);
    app.use(corsHandler);

    logging.log('----------------------------------------');
    logging.log('Define Controller Routing');
    logging.log('----------------------------------------');
    app.get('/api/healthcheck', (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json({ hello: 'world!' });
    });

    logging.log('----------------------------------------');
    logging.log('Define Routing Error');
    logging.log('----------------------------------------');
    app.use(routeNotFound);

    logging.log('----------------------------------------');
    logging.log('Starting Server');
    logging.log('----------------------------------------');
    httpServer = http.createServer(app);
    httpServer.listen(config.server.port, () => {
        logging.log('----------------------------------------');
        logging.log(`Server started on ${config.server.hostname}:${config.server.port}`);
        logging.log('----------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
