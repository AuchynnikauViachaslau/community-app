import { EChartOption } from 'echarts/lib/echarts';

export interface WinRateDiagramData {
  Options: EChartOption;
}

export enum BattleStatus {
  Init,
  Wait,
  Play,
  Error
}

export enum ResultStatus {
  Init,
  Win,
  Lose,
  Draw
}

export enum AuthStatus {
  NotAuthorized,
  Registered,
  Authorized
}

export enum SocketStatus {
  Opened,
  Closed
}

export enum RoomStatus {
  Waiting,
  InGame,
  Closed
}

export enum RestorePasswordStatus {
  Init,
  Wait,
  Success,
  Fail
}

export interface RoomInfo {
  id: number;
  gameId: number;
  maxPlayersCount: number;
  playersCount: number;
  status: RoomStatus;
  distance?: number;
}

export interface FrontEndValidationErrorsRegister {
  email: { mustBeCorrect: string, required: string };
  password: { min: string, required: string };
  name: { min: string, required: string };
}

export interface FrontEndValidationErrorsLogin {
  email: { mustBeCorrect: string, required: string };
  password: { min: string, required: string };
}

export interface FrontEndValidationErrorsChangePassword {
  oldPassword: { required: string, min: string };
  newPassword: { required: string, min: string };
  repeatNewPassword: { required: string, min: string, mustMatch: string };
}
export interface UserFieldsToRegister {
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}

export interface UserFieldsToLogin {
  email: string;
  password: string;
}

export enum LoadStatus {
  Init,
  Fetching,
  Success,
  Error
}

export enum StatTab {
  BestUsers = 0,
  TheMostPopularGames = 1,
  RecentGames = 2
}

export interface ErrorsFromServer {
  [key: string]: { code: number; msg: string };
}

export interface FrontEndSnackbarData {
  type: 'error' | 'warning' | 'info' | 'success';
  msg: string;
}

export enum SnackbarType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success'
}

export enum transitionDirection {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down'
}

export enum Languages {
  En = 'en',
  Ru = 'ru'
}

export enum RowProperty {
  Name = 'name',
  PlayedTime = 'playedTime',
  Scores = 'scores',
  PlayedInWeek = 'playedInWeek',
  Game = 'game',
  AppName = 'appName',
  Result = 'result',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export enum TypeOfColumn {
  String = 'String',
  TimeCount = 'Spent Time',
  Points = 'Points',
  Result = 'Result',
  Date = 'Date'
}
export interface GameModel {
  id?: number;
  userId?: number;
  appName: string;
  description: string;
  maxRoomPlayer: number;
  maxRooms: number;
  requestUrl: string;
  maxWaitingTime: number;
  createAt?: Date;
  updatedAt?: Date;
  redirectUrl: string;
  registrationEventName: string;
  leaveEventName: string;
  updateRoomsInfoEventName: string;
  notifyCountdown: string;
  approve: boolean;
  appToken?: string;
}
export interface HeaderName {
  headerName: string;
  field: RowProperty;
  type: TypeOfColumn;
  editAction?(payload: number): void;
  deleteAction?(payload: GameModel): void;
  lockAction?(payload: string): void;
}

export interface Row {
  [key: string]: any;
}

export interface GameForSettingForm {
  appName: string;
  description: string;
  maxRoomPlayer: number;
  maxRooms: number;
  requestUrl: string;
  maxWaitingTime: number;
  redirectUrl: string;
}

export enum SettingFormType {
  EditGame = 'Edit Game',
  AddGame = 'Add Game'
}

export enum chartsTypes {
  WinRate = 'winRate',
  NoChartsAvailable = 'noChartsAvailable'
}

export const JsMarathonCharts: string[] = [chartsTypes.WinRate];

export const MyGameCharts: string[] = [chartsTypes.WinRate];
export interface Errors {
  [key: string]: [{ code: number; msg: string }];
}

export interface AppMenuItem {
  icon: JSX.Element;
  title: string;
  action: () => void;
}

export interface FrontEndValidationErrorsGameRegister {
  appName: { length: string, required: string };
  description: { length: string, required: string };
  maxRoomPlayer: { count: string, required: string };
  maxRooms: { count: string, required: string };
  requestUrl: { mustBeCorrect: string, required: string };
  maxWaitingTime: { mustBeCorrect: string, required: string };
  redirectUrl: { mustBeCorrect: string, required: string };
}
