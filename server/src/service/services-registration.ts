import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { LoggerService, LoggerServiceImplementation } from './logger';
import { SocketServiceImplementation, SocketService } from './socket';
import { QueueServiceImplementation, QueueService } from './queue';
import { ErrorServiceImplementation, ErrorService } from './error';

export const CONTAINER = new Container();

CONTAINER.bind<LoggerService>(LoggerService).to(LoggerServiceImplementation);
CONTAINER.bind<SocketService>(SocketService).to(SocketServiceImplementation);
CONTAINER.bind<QueueService>(QueueService).to(QueueServiceImplementation);
CONTAINER.bind<ErrorService>(ErrorService).to(ErrorServiceImplementation);

export const inject = getDecorators(CONTAINER).lazyInject;
