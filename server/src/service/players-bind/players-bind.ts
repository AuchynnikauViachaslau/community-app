import { injectable, inject } from 'inversify';
import { Room } from '../room/models';
import axios from 'axios';

import { AppTokenService } from '../app-token';
import { LoggerService } from '../logger';
import { MyGameInterface } from '../../../models/games';

@injectable()
export class PlayersBindService {
  private playersBinds: PlayersBind[] = [];

  constructor(
    @inject(AppTokenService) private tokenService: AppTokenService,
    @inject(LoggerService) private loggerService: LoggerService
  ) { }

  public getPlayersBinds(): PlayersBind[] {
    return this.playersBinds;
  }

  public getPlayersBindByRoom(room: string): PlayersBind {
    return this.playersBinds.find((playersBind: PlayersBind) => playersBind.room === room);
  }

  public bindPlayer(room: string, bindPlayer: string): void {
    const playersBindIndex = this.playersBinds.findIndex((playersBind: PlayersBind) => playersBind.room === room);

    if (playersBindIndex === -1) {
      this.playersBinds.push({ room, players: [bindPlayer] });
    } else {
      this.playersBinds[playersBindIndex].players.push(bindPlayer);
    }
  }

  public removePlayers(room: string, removePlayer: string): void {
    const playersBindIndex = this.playersBinds
      .findIndex((playersBind: PlayersBind) => playersBind.room === room);

    this.playersBinds[playersBindIndex].players = this.playersBinds[playersBindIndex].players
      .filter((player) => player !== removePlayer);
  }

  public async sendPlayerBind(game: MyGameInterface, room: Room): Promise<boolean> {
    let app: MyGameInterface;
    try {
      app = await this.tokenService.getByAppName(game.appName);
    } catch (error) {
      throw new Error(error.message);
    }

    const sendingPlayersBind = this.playersBinds
      .find((playersBind: PlayersBind) => playersBind.room === room.token);

    return axios.post<any>(`${game.requestUrl}/api/set-user-bind`, sendingPlayersBind, {
      headers: {
        Authorization: 'Bearer ' + app.appToken
      }
    }).then((response) => {
      return response.status === 200;
    }).catch((error) => {
      this.loggerService.errorLog(error);

      return false;
    });
  }
}
