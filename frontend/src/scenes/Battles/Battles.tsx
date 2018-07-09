import './Battles.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { AuthStatus, LoadStatus, Game } from 'models';
import { AppState, LogoutUser } from 'store';

import { BattleProps } from './Battles.model';

import { CaGameCard } from 'components/GameCard';
import { CaSpinner } from 'components/Spinner';

import { InitGames, JoinBattle, LeaveBattle } from 'store';

import { isEmpty } from 'utils/isEmpty';


import Slide from '@material-ui/core/Slide';

import { CaSnackbar } from './../../components/Snackbar/Snackbar';





class CaBattlesComponent extends React.Component<BattleProps, BattleState> {

  constructor(props: any) {
    super(props);
    this.state = { isSnackOpen: false };
  }

  public componentWillReceiveProps(nextProps: BattleProps): void {
    if(nextProps.gamesStatus === LoadStatus.FAILED  ) {
      this.setState({
        isSnackOpen: true
      })
    }
  }


  public componentWillMount(): void {
    if (isEmpty(this.props.games)) {
      this.props.initGames();
    }
  }

  public componentDidMount(): void {
    if (this.props.status === AuthStatus.NOT_AUTHORIZED) {
      this.props.history.push('/login');
    }
  }

  public render(): JSX.Element {
    return (
      <div className="ca-homepage">
        {this.props.children}

        <CaSnackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={ this.state.isSnackOpen }
          autoHideDuration = {4000}
          handleClose= {() => this.closeSnackbar()}
          type="error"
          message={<span> Game fetching Failed! </span>}
          TransitionComponent = {this.transitionUp}
        />

        {!isEmpty(this.props.games) && (
          <div className="ca-homepage__container ca-global-fadeIn">

            {this.props.games.map((game: Game, index: number) => {

              return (
                <div className="ca-homepage__container-for-games" key={index}>
                  <CaGameCard
                    game={game}
                    joinGame={($event) => {
                      this.props.joinBattleAction($event);
                      this.props.history.push(`/battles/${index}`)
                    }}
                    leaveGame={this.props.leaveBattleAction}
                    status={this.props.battleStatus}
                    battleStatus={this.props.battleStatus}
                    waitBattlePlayersCountAction={this.props.waitBattlePlayersCountAction}
                  />
                </div>
              );
            })}
          </div>
        )}
        {isEmpty(this.props.games) && (
          <div className="ca-homepage__spinner-container">
            <CaSpinner isActive={isEmpty(this.props.games)}/>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  status: state.auth.status,
  battleStatus: state.battle.status,
  waitBattlePlayersCountAction: state.battle.waitBattlePlayersCount,
  games: state.games.games
});

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => dispatch(new LogoutUser()),
  joinBattleAction: (name: string) => dispatch(new JoinBattle(name)),
  leaveBattleAction: (name: string) => dispatch(new LeaveBattle(name)),
  initGames: () => dispatch(new InitGames())
});

export const CaBattles = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaBattlesComponent);
