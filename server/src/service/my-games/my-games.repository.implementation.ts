import Promise = require('bluebird');
import { injectable } from 'inversify';

import { MyGameInterface, GamesModel } from '../../../models/games';

import { MyGamesRepository } from './my-games.repository';

@injectable()
export class MyGamesRepositoryImplementation implements MyGamesRepository {
    public deleteGame(gameThatNeedToDelete: MyGameInterface): Promise<MyGameInterface[]> {
        return new Promise<MyGameInterface[]>((resolve, reject) => {
            GamesModel.destroy({
                where: {
                    id: gameThatNeedToDelete.id
                }
            }).then(() => {
                const games = GamesModel.findAll({
                    where: {
                        userId: gameThatNeedToDelete.userId
                    }
                });

                resolve(games);
            });
        });

    }

    public editGame(game: MyGameInterface): Promise<MyGameInterface[]> {
        return GamesModel.upsert({
            id: +game.id,
            userId: +game.userId,
            appName: game.appName,
            description: game.description,
            maxRoomPlayer: +game.maxRoomPlayer,
            maxRooms: +game.maxRooms,
            requestUrl: game.requestUrl,
            maxWaitingTime: +game.maxWaitingTime,
            redirectUrl: game.redirectUrl,
            registrationEventName: game.registrationEventName,
            leaveEventName: game.leaveEventName,
            updateRoomsInfoEventName: game.updateRoomsInfoEventName,
            notifyCountdown: game.notifyCountdown,
            approve: game.approve
        }).then(() => {
            return GamesModel.findAll({
                where: {
                    userId: game.userId
                }
            });
        });

    }

    public addGame(data: MyGameInterface): Promise<MyGameInterface> {
        return new Promise<MyGameInterface>((resolve, reject) => {
            const game = GamesModel.build(
                {
                    userId: +data.userId,
                    appName: data.appName,
                    description: data.description,
                    maxRoomPlayer: +data.maxRoomPlayer,
                    maxRooms: +data.maxRooms,
                    requestUrl: data.requestUrl,
                    maxWaitingTime: +data.maxWaitingTime,
                    redirectUrl: data.redirectUrl,
                    registrationEventName: data.registrationEventName,
                    leaveEventName: data.leaveEventName,
                    updateRoomsInfoEventName: data.updateRoomsInfoEventName,
                    notifyCountdown: data.notifyCountdown,
                    approve: data.approve
                }
            );

            game.save().then(() => resolve(game));
        })

    }

    public getGames(userId: number): Promise<MyGameInterface[]> {
        return GamesModel.findAll({
            where: {
                userId
            }
        });
    }
}
