import * as Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, ignoreElements, map, switchMap } from 'rxjs/operators';

import { HttpWrapper } from 'services';
import { SetLanguage, store } from 'store';
import { GetErrors } from 'store/errors';
import { deleteAuthToken, history, setAuthToken } from 'utils';


import {
  AuthTypes,
  LoginUser,
  LogoutUser,
  RegisterUser,
  SetCurrentUser,
  SuccessRegistration
} from './auth.action';

import { FrontEndUser } from './interfaces';
import { OpenSnackbar } from 'store/snackbar';
import { SnackbarType } from 'models';

export const loginUser$ = (actions$: ActionsObservable<LoginUser>) =>
  actions$.pipe(
    ofType(AuthTypes.LoginUser),
    switchMap(action =>
      from(HttpWrapper.post('api/users/login', action.payload)).pipe(
        map(res => {
          const { token } = res.data;
          Cookies.set('jwtToken', token);
          setAuthToken(token);
          const decoded: FrontEndUser = jwt_decode(token);

          return new SetCurrentUser(decoded);
        }),
        catchError(error => {
          console.log(error.response.data)
          return of(new OpenSnackbar({type: SnackbarType.info, message: 'Screw you'}))
        }
          
        )        
      )
    )
  );

export const registerUser$ = (actions$: ActionsObservable<RegisterUser>) =>
  actions$.pipe(
    ofType(AuthTypes.RegisterUser),
    switchMap(action =>
      from(HttpWrapper.post('api/users/register', action.payload)).pipe(
        map(() => new SuccessRegistration('./login')),
        catchError((error) =>{
          console.log(error.response.data.msg)
          return of(new OpenSnackbar({type: SnackbarType.success, message: 'Fuck you'}))
        } 
        )
      )
    )
  );

export const successRegistration$ = (action$: ActionsObservable<SuccessRegistration>) =>
  action$.ofType(AuthTypes.SuccessRegistration).pipe(
    map(action => {
      history.push(action.payload);
    }),
    ignoreElements()
  );

export const logoutUser$ = (actions$: ActionsObservable<LogoutUser>) =>
  actions$.pipe(
    ofType(AuthTypes.LogoutUser),
    map(() => {
      Cookies.remove('jwtToken');
      deleteAuthToken();

      return new SetCurrentUser(undefined);
    })
  );

export const setCurrentUser$ = (action$: ActionsObservable<SetCurrentUser>) =>
  action$.ofType(AuthTypes.SetCurrentUser).pipe(
    map(action => {
      const user: FrontEndUser | undefined = action.payload;
      if (user) {
        store.dispatch(new SetLanguage(user.email));
      }
    }),
    ignoreElements()
  );

export const AuthEffects = [
  loginUser$,
  registerUser$,
  logoutUser$,
  successRegistration$,
  setCurrentUser$
];
