import { action } from '../decorators';
import { SnackbarType } from 'models'

export enum SnackbarUiTypes {
  CloseSnackbar = '[snackbarUi] Close Snackbar',
  OpenSnackbar = '[snackbarUi] Open Snackbar',
  ToggleSnackbar = '[snackbarUi] Toggle Snackbar',
}

@action()
export class CloseSnackbar {
  public readonly type = SnackbarUiTypes.CloseSnackbar;
}

@action()
export class OpenSnackbar {
  public readonly type = SnackbarUiTypes.OpenSnackbar;

  public constructor(public payload: {
    type: SnackbarType,
    message: any
  }) { }
}

@action()
export class ToggleSnackbar {
  public readonly type = SnackbarUiTypes.ToggleSnackbar;
}

export type SnackbarUiActions =
  | CloseSnackbar
  | OpenSnackbar
  | ToggleSnackbar;
