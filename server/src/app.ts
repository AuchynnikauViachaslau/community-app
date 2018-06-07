import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';
import { Container, inject } from 'inversify';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from "morgan";
import * as SocketIO from 'socket.io';
import * as passport from 'passport';

import {
    LoggerService,
    LoggerServiceImplementation,
    SocketService,
    SocketServiceImplementation
} from './service';

import './controller';
import { CONTAINER } from './service/services-registration'; 

import { db } from './../models/SequalizeConnect';
import { Role } from './../models/role';
import { passportConfig } from './config/passport';

let server = new InversifyExpressServer(CONTAINER);

// tslint:disable-next-line:no-var-requires
const config = require('./config/app.config.json');

server.setConfig((app) => {
    process.env.NODE_ENV !== config.production ? app.use(morgan('dev')) : app.use(morgan('prod'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(passport.initialize());
    passportConfig(passport);
    app.use(bodyParser.json());
    app.use(express.static(config.staticUrl));
});

// makeAssosiations();

db.connect.sync({
    logging: console.log
}).then(() => {
    Role.upsert({
        id: 1,
        name: 'admin',
        createAt: Date.now(),
        updatedAt: Date.now()
    }).then(() => {
        Role.upsert({
            id: 2,
            name: 'user',
            createAt: Date.now(),
            updatedAt: Date.now()
        });
    });
});

let logger: LoggerService = new LoggerServiceImplementation();
let application = server.build();

let serverInstance = application.listen(config.port, () => {
    logger.infoLog(`App is running at http://localhost:${config.port}`);
    logger.infoLog('Press CTRL+C to stop\n');
});

const socketService: SocketService = new SocketServiceImplementation();
socketService.setSocket(SocketIO(serverInstance));
