import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import Promise = require('bluebird');

import {
  GamesRepository
} from '../service/games';
import { Game } from '../../models/games';

@controller('/api/games')
export class GameController {

  public constructor(@inject(GamesRepository) private gameRepository: GamesRepository) {
  }

  @httpGet('/get-games')
    public getGames(request: Request, response: Response): Promise<void | Response> {

      return this.gameRepository.getGames()
        .then((games: Game[]) => {
          response.status(200).json(games);
        }).catch((err) => {
          return response.status(400).json(err);
        });
    }
}
