import { HistoryRepository } from './history.repository';
import { injectable } from 'inversify';
import { Game } from '../../typing/game';

import { HistoryModel, AppTokenModel, UserModel } from './../../../models';
import { Statistic } from '../../controller';
import { Sequelize } from 'sequelize';
import { DataFromGame } from './../../controller/statistic.controller';

import Promise = require('bluebird');
import { isEmpty } from './../../validation/is-empty';
import { resolve } from 'url';

import { AppTokenRepository } from './../app-token/app-token.repository';
import { inject } from 'inversify';
import { HistoryService } from './history.service';


export interface TokenFromDb {
  token: string;
  appName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentGameFromServer {
  game: string;
  playedTime: number;
  scores: number;
  result: boolean;
}

export interface PopularGamesFromServer {
  name: string; 
  playedTime: number;
  playedInWeek: number;
}
export interface BestUsersFromServer {
  id: number;
  name: number;
  playedTime: number;
  scores: number;
}


@injectable()
export class HistoryRepositoryImplementation implements HistoryRepository {
  public constructor(
    @inject(HistoryService) private historyService: HistoryService
  ) {}

  public collectStatistic(
    data: DataFromGame,
    appToken: string
  ): Promise<boolean> {
    let { statistic } = data;

    return AppTokenModel.findOne({
      where: { token: appToken }
    })
      .then((tokenRow: TokenFromDb) => {
        const token = tokenRow && tokenRow.token;
        if (token) {
          let promises: Promise<boolean>[] = [];
          statistic = JSON.parse(statistic); // TODO: why body-parser is not working as expected
          promises = statistic.map((stat: Statistic) =>
            this.saveStatistic(token, stat)
          );

          return Promise.all(promises)
            .then(() => {
              return true;
            })
            .catch(err => err);
        } else {
          return 'you must register your game and provide correct app token';
        }
      })
      .catch((err: any) => err);
  }

  public getRecentGames(userId: number): Promise<RecentGameFromServer[]> {
    return HistoryModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
      // attributes: ['id', 'playedTime', 'scores', 'isWin']
    })
      .then(recentGames => {
        const promises = recentGames.map(game => {
          return AppTokenModel.find({ where: { token: game.appToken } }).then(
            row => row.appName
          );
        });

        return Promise.all(promises)
          .then(appNames => {
            console.log('APP NAMES', appNames);
            recentGames = recentGames.reduce((accumulator, game, index) => {
              const gameName = appNames[index];

              let result = {
                game: gameName,
                playedTime: game.playedTime,
                scores: game.scores,
                result: game.isWin
              };

              return accumulator.concat(result);
            }, []);

            return recentGames;
          })
          .catch(err => err);
      })
      .catch(err => err);
  }

  public getMostPopularGames(): Promise<PopularGamesFromServer[]> {
    return new Promise<PopularGamesFromServer[]>((resolvePopularGames, reject) => {
      AppTokenModel.findAll({ attributes: ['token', 'appName'] })
        .then((gamesAndTokens: {token: string, appName: string}[]) => {
          const tokens = gamesAndTokens.map(row => row.token);

          const promises = tokens.map(currentToken => {
            return HistoryModel.findAll({
              where: { appToken: currentToken }
            })
              .then(historyRows => {
                const playedTime = historyRows
                  .map(row => row.playedTime)
                  .reduce((a, b) => a + b);

                const playedInWeek = this.historyService.calculatePlayedInWeek(
                  historyRows
                );

                let result = {
                  token: currentToken,
                  playedTime,
                  playedInWeek
                };
        
                return result;
              })
              .catch(err => reject(err));
          });

          return Promise.all(promises)
            .then((allGamesAndItsPlayedTime: { token: string; playedTime: number; playedInWeek: number; }[]) => {
              let mostPopularGames = allGamesAndItsPlayedTime.reduce(
                (accumulator, game) => {
                  const gameName = gamesAndTokens.find(
                    el => el.token === game.token
                  ).appName;

                  let result = {
                    name: gameName,
                    playedTime: game.playedTime,
                    playedInWeek: game.playedInWeek
                  };

                  return accumulator.concat(result);
                },
                []
              );
              mostPopularGames = this.historyService.sortBy(
                mostPopularGames,
                'playedTime'
              );

              return resolvePopularGames(mostPopularGames);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  public getBestUsers(): Promise<BestUsersFromServer[]> {
    return new Promise<BestUsersFromServer[]>((resolveBestUsers, reject) => {
      UserModel.findAll({ attributes: ['id', 'name', 'isActive'] })
        .then(users => {
          const promises = users.map(currentUser => {
            if (currentUser.isActive) {
              return HistoryModel.findAll({
                where: { userId: currentUser.id }
              })

                .then(historyRows => {
                  let playedTimeArr = historyRows.map(row => row.playedTime);
                  let playedTime = 0;
                  if (!isEmpty(playedTimeArr)) {
                    playedTime = playedTimeArr.reduce((a, b) => a + b);
                  }

                  let scoresArray = historyRows.map(row => {
                    if (row.playedTime) {
                      return row.scores;
                    }
                  });
                  let scores = 0;
                  if (!isEmpty(scoresArray)) {
                    scores = scoresArray.reduce((a, b) => a + b);
                  }

                  let result = {
                    id: currentUser.id,
                    name: currentUser.name,
                    playedTime,
                    scores
                  };
    
                  return result;
                })
                .catch(err => reject(err));
            } else {
              reject('User should be Active');
            }
          });

          return Promise.all(promises)
            .then(allUsersStatistic => {
              let bestUsers = this.historyService
                .sortBy(allUsersStatistic, 'scores')
                .filter(user => user.scores > 0);
              console.log('BEST USERS', bestUsers);

              return resolveBestUsers(bestUsers);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  private saveStatistic(token: string, stat: Statistic): Promise<boolean> {
    const newHistory = HistoryModel.build({
      appToken: token,
      userId: stat.userId,
      playedTime: stat.playedTime,
      scores: stat.scores,
      isWin: stat.isWin
    });

    return newHistory
      .save()
      .then((savedHistory: Statistic) => true)
      .catch((err: any) => err);
  }
}
