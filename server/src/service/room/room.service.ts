import { injectable, inject } from 'inversify';
import { ApiService, NewRoomResponse } from '../api';
import { Game } from '../../typing/game';
import { LoggerService } from '../logger';
import { TimerService } from './../timer';

import { RoomStatus, Room } from './models';

@injectable()
export class RoomService {
  private games: Game[] = require('../../config/games.json').games;
  @inject(ApiService) private apiService: ApiService;
  @inject(LoggerService) private loggerService: LoggerService;
  @inject(TimerService) private timerService: TimerService;

  private rooms: Room[] = [];

  public getRoomByIndex(index: number): Room | undefined {
    return this.rooms.find(r => r.id === index);
  }

  public createNewRoom(index: number, client: SocketIO.Socket): Promise<boolean> {
    return this.apiService.startNewRoom(`${this.games[index].requestUrl}/api/start-new-room`, {}).then((response: NewRoomResponse) => {
      let isCreated = false;

      if (response.status === 'OK') {
        this.rooms.push({
          id: index,
          maxPlayersCount: this.games[index].maxRoomPlayer,
          players: [client],
          token: response.token,
          status: RoomStatus.Waiting
        });

        this.loggerService.infoLog(`New room was added for ${this.games[index].name}`);
        this.loggerService.infoLog(`Current count of players is 1`);

        isCreated = true;
      } else {
        this.loggerService.errorLog(`New room was not added for ${this.games[index].name}`);
      }

      return isCreated;
    });
  }

  public addPlayerToRoom(index: number, client: SocketIO.Socket): Promise<[boolean, Room]> {
    /*
    * @todo refactor for lock async operations (multiple users)
    * */
    const room: Room | undefined = this.rooms.find(r => r.id === index);
    let operation$ = Promise.resolve(true);

    if (room && room.players.length < room.maxPlayersCount && room.status === RoomStatus.Waiting) {
      room.players.push(client);

      this.loggerService.infoLog(`Add player to ${this.games[index].name} room`);
      this.loggerService.infoLog(`Current count of players is ${room.players.length}`);
    } else {
      operation$ = this.createNewRoom(index, client).then(result => {

        let newRoom = this.rooms.find(r => r.id === index);
        let timer = this.timerService.start(
          (distance: number) => {
            this.loggerService.infoLog(`Countdown ${distance} -> ${this.games[index].name}`);
            newRoom.distance = distance;

            let roundDistance = Math.round(distance / 1000);

            if (roundDistance % 30 === 0 || roundDistance === 15 || roundDistance === 10 || roundDistance === 5) {
              this.countdown(newRoom, index, distance);
            }
          },
          () => {
            this.loggerService.infoLog(`Start game by timer -> ${this.games[index].name}`);
            this.startGame(newRoom, index);
          },
          this.games[index].maxWaitingTime);

        newRoom.timer = timer;

        return result;
      });
    }

    return operation$.then((isAdded: boolean) => {
      this.checkWaitPlayersCount(index);
      let updatedRoom = this.rooms.find(r => r.id === index);

      return [isAdded, updatedRoom] as [boolean, Room];
    });
  }

  public removePlayerFromRoom(index: number, client: SocketIO.Socket): Promise<[boolean, Room]> {
    /*
    * @todo refactor for lock async operations (multiple users)
    * */
    let room = this.rooms.find(r => r.id === index);
    const operation$ = Promise.resolve(true);

    if (room && room.players.length > 1) {
      room.players = [...room.players.filter(p => p !== client)];

      this.loggerService.infoLog(`Remove player from ${this.games[index].name} room`);
      this.loggerService.infoLog(`Current count of players is ${room.players.length}`);
    } else if (room) {
      this.timerService.end(room.timer);
      this.rooms = [...this.rooms.filter(r => r.id !== index)];
      room.players = [];

      this.loggerService.infoLog(`Remove ${this.games[index].name} room`);
    }

    return operation$.then(result => {
      if (room) {
        this.checkWaitPlayersCount(room.id);
      }

      return [result, room] as [boolean, Room];
    });
  }

  public removePlayer(client: SocketIO.Socket): Promise<[boolean, Room]> {
    /*
    * @todo refactor for lock async operations (multiple users)
    * */
    let room = this.rooms.find(r => {
      return !!r.players.find(p => p === client);
    });

    const operation$ = Promise.resolve(true);

    if (room && room.players.length > 1) {
      room.players = [...room.players.filter(p => p !== client)];

      this.loggerService.infoLog(`Remove player from ${this.games[room.id].name} room`);
      this.loggerService.infoLog(`Current count of players is ${room.players.length}`);
    } else if (room) {
      this.timerService.end(room.timer);
      this.rooms = [...this.rooms.filter(r => r.id !== room.id)];
      room.players = [];

      this.loggerService.infoLog(`Remove ${this.games[room.id].name} room`);
    }

    return operation$.then(result => {
      if (room) {
        this.checkWaitPlayersCount(room.id);
      }

      return [result, room] as [boolean, Room];
    });
  }

  private checkWaitPlayersCount(index: number): void {
    let room = this.rooms.find(r => r.id === index);

    if (room && room.players.length === this.games[index].maxRoomPlayer) {
      this.timerService.end(room.timer);
      this.startGame(room, index);
    }
  }

  private startGame(room: Room, index: number): void {
    room.players.forEach((player: SocketIO.Socket) => {
      player.emit(this.games[index].getWaitPlayersCountEventName, room.players.length);
      this.loggerService.infoLog(`Sent count wait players in ${this.games[index].name}`);

      player.emit('redirect', this.games[index].requestUrl);
      this.loggerService.infoLog(`Redirect players group to ${this.games[index].name}`);
    });
    room.status = RoomStatus.InGame;
  }

  private countdown(room: Room, index: number, distance: number): void {
    room.players.forEach((player: SocketIO.Socket) => {
      player.emit(this.games[index].notifyCountdown, distance);
    });
  }
}
