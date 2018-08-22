import { ErrorsFromServer } from 'models';

import { action } from '../decorators';

export enum StatisticTypes {
  InitBestUsers = '[statistic] Init Best Users',
  LoadBestUsersSuccess = '[statistic] Load Best Users (Success)',
  LoadBestUsersError = '[statistics] Load Best Users (Error)',
  InitMostPopularGames = '[statistic] Init Most Popular Games',
  LoadMostPopularGamesSuccess = '[statistic] Load Most Popular Games(Success)',
  LoadMostPopularGamesError = '[statistics] Load Most Popular Games (Error)',
  InitRecentGames = '[statistic] Init Recent Games',
  LoadRecentGamesSuccess = '[statistic] Load Recent Games (Success)',
  LoadRecentGamesError = '[statistic] Load Recent Games (Error)',
  CleanStatistic = '[statistic] Clean Statistic'
}

@action()
export class InitBestUsers {
  public readonly type = StatisticTypes.InitBestUsers;
}

@action()
export class LoadBestUsersCompleted {
  public readonly type = StatisticTypes.LoadBestUsersSuccess;

  constructor(public payload: any[]) { }
}

@action()
export class LoadBestUsersError {
  public readonly type = StatisticTypes.LoadBestUsersError;

  constructor(public err: ErrorsFromServer) { }
}

@action()
export class InitMostPopularGames {
  public readonly type = StatisticTypes.InitMostPopularGames;
}

@action()
export class LoadMostPopularGamesCompleted {
  public readonly type = StatisticTypes.LoadMostPopularGamesSuccess;

  constructor(public payload: any[]) { }
}

@action()
export class LoadMostPopularGamesError {
  public readonly type = StatisticTypes.LoadMostPopularGamesError;

  constructor(public err: ErrorsFromServer) { }
}

@action()
export class InitRecentGames {
  public readonly type = StatisticTypes.InitRecentGames;

  constructor(public userToken: string) { }
}

@action()
export class LoadRecentGamesCompleted {
  public readonly type = StatisticTypes.LoadRecentGamesSuccess;

  constructor(public payload: any[]) { }
}

@action()
export class LoadRecentGamesError {
  public readonly type = StatisticTypes.LoadRecentGamesError;

  constructor(public payload: any ) { }
}

@action()
export class CleanStatistic {
  public readonly type = StatisticTypes.CleanStatistic;
}

export type StatisticAction =
  | InitBestUsers
  | LoadBestUsersCompleted
  | LoadBestUsersError
  | InitMostPopularGames
  | LoadMostPopularGamesCompleted
  | LoadMostPopularGamesError
  | InitRecentGames
  | LoadRecentGamesCompleted
  | LoadRecentGamesError
  | CleanStatistic;
