import { AuthStatus } from 'models';

export interface RootProps {
  status: AuthStatus;
  history: any;
  battleName: string;

  leaveBattle(battleName: string): void;

  logoutUser(): void;

  cleanStatistic(): void;

  changeLanguage(language: string): void;
}
