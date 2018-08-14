import * as openSocket from 'socket.io-client';

import { MyGameModel, RoomInfo } from 'models';
import { Subject } from 'rxjs';

export class SocketService {
  public roomsInfo: Subject<RoomInfo[]> = new Subject();
  public notifyCountdown: Subject<number> = new Subject();

  private socket: SocketIOClient.Socket;

  public constructor() {
    this.socket = openSocket('http://localhost:3030');
  }

  public init(games: MyGameModel[]): void {
    for (const game of games) {
      this.socket.on(
        game.updateRoomsInfoEventName,
        (roomsInfo: RoomInfo[]) => this.roomsInfo.next(roomsInfo)
      );
      this.socket.on(
        game.notifyCountdown,
        (distance: number) => this.notifyCountdown.next(distance)
      );
    }
  }

  public emitEvent(eventName: string): void {
    this.socket.emit(eventName);
  }

  public emitEventWithOptions(eventName: string, opts?: any): void {
    this.socket.emit(eventName, opts);
  }

  public getRoomUrl(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('redirect', (redirectUrl: string) => res(redirectUrl));
    });
  }
}
