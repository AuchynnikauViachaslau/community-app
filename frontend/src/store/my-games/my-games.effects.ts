import { ActionsObservable, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpWrapper } from 'services';

import { GameModel, ErrorBlock, SnackbarType } from 'models';

import {
    AddGame,
    AddGameError,
    AddGameSuccess,
    DeleteGame,
    DeleteGameError,
    DeleteGameSuccess,
    EditGame,
    EditGameError,
    EditGameSuccess,
    InitMyGames,
    LoadMyGamesError,
    LoadMyGamesSuccess,
    MyGamesActionTypes
} from './my-games.action';
import { OpenSnackbar } from '../snackbar';

export const deleteGame$ = (action$: ActionsObservable<DeleteGame>) =>
    action$.pipe(
        ofType(MyGamesActionTypes.DeleteGame),
        switchMap(action =>
            from(HttpWrapper.post<GameModel, GameModel[]>('api/v1/my-games/delete-game', action.payload)).pipe(
                map(response => new DeleteGameSuccess(response.data)),
                catchError(error => {
                    const messages: ErrorBlock[] =
                    error.name !== 'Error' ? [{msg: error.message}] :
                    Array.isArray(error.response.data) ? error.response.data :
                    [error.response.data];
                    new DeleteGameError();

                    return of(new OpenSnackbar({ type: SnackbarType.Error, messages}));
                })
            )
        )
    );

export const editGame$ = (action$: ActionsObservable<EditGame>) =>
    action$.pipe(
        ofType(MyGamesActionTypes.EditGame),
        switchMap(action =>
            from(HttpWrapper.post<GameModel, GameModel[]>('api/v1/my-games/edit-game', action.payload)).pipe(
                map(response =>  new EditGameSuccess(response.data)),
                catchError(error => {
                    const messages: ErrorBlock[] =
                    error.name !== 'Error' ? [{msg: error.message}] :
                    Array.isArray(error.response.data) ? error.response.data :
                    [error.response.data];
                    new EditGameError();

                    return of(new OpenSnackbar({ type: SnackbarType.Error, messages}));
                })
            )
        )
    );

export const addGame$ = (action$: ActionsObservable<AddGame>) =>
    action$.pipe(
        ofType(MyGamesActionTypes.AddGame),
        switchMap(action => {
            return from(HttpWrapper.post<GameModel, GameModel>('api/v1/my-games/add-game', action.payload)).pipe(
                map(response => new AddGameSuccess(response.data)),
                catchError(error => {
                    const messages: ErrorBlock[] =
                    error.name !== 'Error' ? [{msg: error.message}] :
                    Array.isArray(error.response.data) ? error.response.data :
                    [error.response.data];
                    new AddGameError();

                    return of(new OpenSnackbar({ type: SnackbarType.Error, messages}));
                })
            );
            }
        )
    );

export const initMyGames$ = (action$: ActionsObservable<InitMyGames>) =>
    action$.pipe(
        ofType(MyGamesActionTypes.InitMyGames),
        switchMap(action =>
            from(HttpWrapper.get<GameModel[]>(`api/v1/my-games/get-games?userId=${action.payload}`)).pipe(
                map((response) => new LoadMyGamesSuccess(response.data)),
                catchError(error => {
                    const messages: ErrorBlock[] =
                    error.name !== 'Error' ? [{msg: error.message}] :
                    Array.isArray(error.response.data) ? error.response.data :
                    [error.response.data];
                    new LoadMyGamesError(error);

                    return of(new OpenSnackbar({ type: SnackbarType.Error, messages}));
                    }
                )
            )
        )
    );

export const MyGamesEffects = [
    deleteGame$,
    editGame$,
    addGame$,
    initMyGames$
];
