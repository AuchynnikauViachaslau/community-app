import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  AuthStatus,
  GameModel,
  MoreMenuItem,
  RoomInfo
} from 'models';

import { CaGameCard, CaSpinner } from 'components';
import { isEmpty } from 'utils';

import {
  AppState,
  JoinBattle,
  LeaveBattle,
  LoadGames,
  LogoutUser
} from 'store';

import { BattleProps } from './Battles.model';

import './Battles.scss';

class CaBattlesComponent extends React.Component<BattleProps> {

  public componentWillMount(): void {
    const isAuthenticated = this.props.authStatus === AuthStatus.Authorized;

    if (!isAuthenticated) {
      this.props.history.push('/login');
    }

    this.props.initGames();
  }

  public getGameRooms = (game: GameModel): RoomInfo[] => {
    return this.props.roomsInfo.filter(r => r.gameId === game.id);
  }

  public getNearestCountdown = (rooms: RoomInfo[]): number => {
    const mappedRooms = rooms
      .map(r => r.distance)
      .filter(d => !!d);

    const sortedRooms = mappedRooms && mappedRooms.length ? mappedRooms
      .sort((a: number | undefined, b: number | undefined) => {
        return a && b ? a - b : 1 - 2;
      }) as number[] : [];

    return sortedRooms && sortedRooms[0] ? sortedRooms[0] : 0;
  }

  // ?????
  public getRoomId = (rooms: RoomInfo[]): number => {
    for (let index = 0; index < rooms.length; index++) {
      if (rooms[index].playersCount !== rooms[index].maxPlayersCount) {
        return rooms[index].id;
      }
    }
    return Math.random();
  }

  public render(): JSX.Element {
    return (
      <div className='ca-homepage'>
        {this.props.children}

        {!isEmpty(this.props.games) && (
          <div className='ca-homepage__container ca-global-fadeIn'>
            {this.props.games.map((game: GameModel) => {
              const moreMenuItems: MoreMenuItem[] = [
                {
                  title: 'leaders',
                  action: () => this.props.history.push(`/leaders/${game.appName}`)
                }
              ];

              const gameRooms = this.getGameRooms(game);
              const waitBattlePlayersCount = gameRooms && gameRooms.length ? gameRooms
                .map(r => r.playersCount)
                .reduce((accumulator, currentValue: number) => accumulator + currentValue) : 0;

              return (
                <div className='ca-homepage__container-for-games' key={this.getRoomId(gameRooms)}>
                  <CaGameCard
                    game={game}
                    joinGame={($event) => {
                      this.props.joinBattleAction($event);
                      this.props.history.push(`/current-battles`);
                    }}
                    moreMenuItems={moreMenuItems}
                    leaveGame={this.props.leaveBattleAction}
                    status={this.props.battleStatus}
                    battleStatus={this.props.battleStatus}
                    waitBattlePlayersCountAction={waitBattlePlayersCount}
                    isFull={waitBattlePlayersCount === game.maxRoomPlayer}
                    battleStartTime={new Date((new Date()).getTime() + this.getNearestCountdown(gameRooms))}
                  />
                </div>
              );
            })}
          </div>
        )}
        {this.props.status === 1 && (
          <div className='ca-homepage__spinner-container'>
            <CaSpinner isActive={this.props.status === 1} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  authStatus: state.auth.status,
  battleStatus: state.battle.status,
  roomsInfo: state.room.roomsInfo,
  games: state.games.games,
  status: state.games.gamesStatus,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logoutUser: () => dispatch(new LogoutUser()),
  joinBattleAction: (name: string) => dispatch(new JoinBattle(name)),
  leaveBattleAction: (name: string) => dispatch(new LeaveBattle(name)),
  initGames: () => dispatch(new LoadGames())
});

export const CaBattles = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaBattlesComponent);
