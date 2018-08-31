import { BattleStatus, GameModel, MoreMenuItem } from 'models';

export interface GameCardProps {
  game: GameModel;
  status: BattleStatus;
  battleStatus: BattleStatus;
  waitBattlePlayersCountAction: number;
  isFull?: boolean;
  battleStartTime: Date;
  moreMenuItems: MoreMenuItem[];

  joinGame($event: string): void;

  leaveGame($event: string): void;
}