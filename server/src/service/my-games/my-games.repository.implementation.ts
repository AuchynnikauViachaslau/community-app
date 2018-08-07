import { MyGamesRepository } from './my-games.repository';
import { injectable } from 'inversify';

// import Promise = require('bluebird');
// import { inject } from 'inversify';
// import { MyGamesService } from './my-games.service';

// import { GameData } from '../../controller/my-game.controller';
import { MyGameInterface, GamesModel } from '../../../models/games';
import Promise = require('bluebird');

@injectable()
export class MyGamesRepositoryImplementation implements MyGamesRepository {
    public deleteGame(gameThatNeedToDelete: MyGameInterface): Promise<MyGameInterface[]>  {
        return GamesModel.destroy({
            where: {
              id: gameThatNeedToDelete.id
            }
        }).then(() => {
            return GamesModel.findAll({
                where: {
                    userId: gameThatNeedToDelete.userId
                }
            });
        })
    }

    public editGame(data: MyGameInterface): void {
        console.log(`EDIT MyGamesRepositoryImplementation`);
        console.log(data);
    }

    public addGame(data: MyGameInterface): Promise<MyGameInterface> {
        console.log(data);

        const game = GamesModel.build(
            {
                userId: +data.userId,
                appName: data.appName,
                description: data.description,
                maxRoomPlayer: +data.maxRoomPlayer,
                maxRooms: +data.maxRooms,
                requestUrl: data.requestUrl,
                maxWaitingTime: +data.maxWaitingTime
            }
        );

        return game.save();
    }

    public getGames(userId: number): Promise<MyGameInterface[]> {
        return GamesModel.findAll({
            where: {
                userId
            }
        });
    }
}
