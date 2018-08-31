import * as React from 'react';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import clockImage from 'assets/clock-small.svg';
import swordImage from 'assets/sword.svg';
import userImage from 'assets/user-small.svg';
import { CaButton, Countdown } from 'components';

import {
  AppState,
  LeaveRoom,
  LogoutUser
} from 'store';

import {
  AuthStatus,
  BattleStatus,
} from 'models';

import { CurrentBattleProps } from './CurrentBattle.model';

import './CurrentBattle.scss';

export class CurrentBattleComponent extends React.Component<CurrentBattleProps> {
  public componentWillMount(): void {
    if (this.props.authStatus === AuthStatus.NotAuthorized) {
      this.props.history.push('/battles');
    }

    if (this.props.gameStatus === BattleStatus.Init) {
      this.props.history.push('/login');
    }
  }

  public isGameFull(): boolean {
    return this.props.currentPlayerRoom ?
      this.props.currentPlayerRoom.playersCount === this.props.currentPlayerRoom.maxPlayersCount :
      false;
  }

  public getPlayersCount(): number {
    return this.props.currentPlayerRoom ? this.props.currentPlayerRoom.playersCount : 0;
  }

  public getGameName = (): string => {
    return this.props.currentPlayerRoom ? this.props.currentPlayerRoom.gameName : '';
  }

  public getGameDescription = (): string => {
    return this.props.currentPlayerRoom ? this.props.currentPlayerRoom.description : '';
  }

  public getGameCountdown = (): number => {
    return this.props.currentPlayerRoom && this.props.currentPlayerRoom.distance ? this.props.currentPlayerRoom.distance : 0;
  }

  public getGameMaxRoomPlayer = (): number => {
    return this.props.currentPlayerRoom ? this.props.currentPlayerRoom.maxPlayersCount : 0;
  }

  public getGameMaxWaitingTime = (): number => {
    return this.props.currentPlayerRoom ? this.props.currentPlayerRoom.maxWaitingTime : 0;
  }

  public handleLeaveRoom = () => {
    this.props.leaveBattleAction(this.getGameName());
    this.props.history.push('/battles');
  }

  public render(): JSX.Element {
    return (
      < I18n >
        {
          (t) => (
            <section className='ca-current-battle'>
              {this.props.children}
              <div className='ca-current-battle__content'>
                <div className='ca-current-battle__header'>
                  <div className='ca-current-battle__logo'>
                    <img src={swordImage} alt='Can not found User img' />
                  </div>
                  <div className='ca-current-battle__header-text'>
                    <div className='ca-current-battle__title'>
                      {this.getGameName()}
                    </div>
                    <div className='ca-current-battle__sub-title'>
                      {this.getGameDescription()}
                    </div>
                  </div>
                </div>

                <div className='ca-current-battle__time-line'>
                  <div className='ca-current-battle__time'>
                    <span className='ca-current-battle__time-description'>{t('startingIn') + ':'}</span>
                    <Countdown time={this.getGameCountdown()} />
                  </div>
                  <div className='ca-current-battle__start-button'>

                    <CaButton
                      disabled={!this.isGameFull()}
                    >
                      {t('startTheBattle')}
                    </CaButton>

                  </div>
                </div>

                <div className='ca-current-battle__info'>
                  <div className='ca-current-battle__info-icon'>
                    <img src={userImage} alt='Can not found User img' />
                  </div>
                  <span className='ca-current-battle__info-text'>{t('players') + ':'}</span>
                  <span
                    className='ca-current-battle__info-count'>{this.getPlayersCount()}/{this.getGameMaxRoomPlayer()}</span>
                </div>

                <div className='ca-current-battle__info'>
                  <div className='ca-current-battle__info-icon'>
                    <img src={clockImage} alt='Can not found User img' />
                  </div>
                  <span className='ca-current-battle__info-text'>{t('battleTime') + ':'} </span>
                  <span
                    className='ca-current-battle__info-count'>{t('minutes', { count: this.getGameMaxWaitingTime() })}</span>
                </div>

                <div className='ca-current-battle__invite-button'>
                  <CaButton
                    disabled={true}
                  >
                    {t('inviteFriend')}
                  </CaButton>
                </div>

                <div className='ca-current-battle__leave-button'>
                  <CaButton
                    onClick={this.handleLeaveRoom}
                  >
                    {t('leaveTheRoom')}
                  </CaButton>
                </div>

              </div>
            </section>
          )
        }
      </I18n>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  rooms: state.room.rooms,
  currentPlayerRoom: state.room.currentPlayerRoom,
  gameStatus: state.room.battleStatus,
  authStatus: state.auth.status,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  leaveBattleAction: (name: string) => dispatch(new LeaveRoom(name)),
  logoutUser: () => dispatch(new LogoutUser())
});

export const CurrentBattle = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentBattleComponent);
