import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from "morgan";

import {
    LoggerService,
    LoggerServiceImplementation,
    SocketService,
    SocketServiceImplementation,
    QueueServiceImplementation
} from './service';

import './controller';
import { CONTAINER } from './service/services-registration';

let server = new InversifyExpressServer(CONTAINER);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(express.static('../build'));
});

let logger: LoggerService = new LoggerServiceImplementation();
let application = server.build();

let serverInstance = application.listen(3030, () => {
    logger.log(`App is running at http://localhost:3030`);
    logger.log('Press CTRL+C to stop\n');
});

const socket: SocketService = new SocketServiceImplementation(logger, new QueueServiceImplementation(logger));
socket.connection(serverInstance);
