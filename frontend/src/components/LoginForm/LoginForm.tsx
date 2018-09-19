import * as React from 'react';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { FormGroup, TextField } from '@material-ui/core';
import { CaButton, VkDialog } from 'components';
import { emailRegExp, frontEndValidationErrorsLogin } from 'constes';
import { SocialNetworksUser, VkSuccessResponse, GoogleSuccessResponse, GoogleErrorResponse } from 'models';
import { AppState, LoginUser, SocialNetworksLogin } from 'store';
import { getCurrentLanguageFromLocalStorage } from 'utils';

import {
  AuthStatus,
  UserFieldsToLogin,
  UserFieldsToRegister,
} from 'models';

import {
  LoginFormProps,
  LoginFormState,
  initLoginFormState
} from './LoginForm.model';

import './LoginForm.scss';

export class LoginFormComponent extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = initLoginFormState;
  }

  public componentWillReceiveProps(nextProps: LoginFormProps): void {
    if (nextProps.status === AuthStatus.Authorized) {
      this.props.history.push('/homepage');
    }
  }

  public componentDidMount(): void {
    if (this.props.status === AuthStatus.Authorized) {
      this.props.history.push('/homepage');
    }
  }

  public onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const email = event.target.value;

    this.setState({ email });
  }

  public onChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const password = event.target.value;

    this.setState({ password });
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const user: UserFieldsToLogin = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  }

  public checkValidation = (): void => {
    let emailErrors: string[] = [];
    let passwordErrors: string[] = [];

    if (!this.state.email) {
      emailErrors.push(frontEndValidationErrorsLogin.email.required);
    } else {
      emailErrors = this.removeElFromArrByValue(
        emailErrors,
        frontEndValidationErrorsLogin.email.required
      );
    }

    if (!this.validateEmail(this.state.email)) {
      emailErrors.push(frontEndValidationErrorsLogin.email.mustBeCorrect);
    } else {
      emailErrors = this.removeElFromArrByValue(
        emailErrors,
        frontEndValidationErrorsLogin.email.mustBeCorrect
      );
    }

    if (!this.state.password) {
      passwordErrors.push(frontEndValidationErrorsLogin.password.required);
    } else {
      passwordErrors = this.removeElFromArrByValue(
        passwordErrors,
        frontEndValidationErrorsLogin.password.required
      );
    }

    if (this.state.password.length < 6) {
      passwordErrors.push(frontEndValidationErrorsLogin.password.min);
    } else {
      passwordErrors = this.removeElFromArrByValue(
        passwordErrors,
        frontEndValidationErrorsLogin.password.min
      );
    }

    if (emailErrors.length <= 0) {
      this.setState({ isEmailValid: true });
    } else {
      this.setState({ isEmailValid: false });
    }

    if (passwordErrors.length <= 0) {
      this.setState({ isPasswordValid: true });
    } else {
      this.setState({ isPasswordValid: false });
    }

    this.setState({ emailErrors, passwordErrors });
  }

  public onBlur = (field: string) => (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    });
    this.checkValidation();
  }

  public redToRegistratePage(): void {
    this.props.history.push('/register');
  }

  public redToForgetPassword(): void {
    this.props.history.push('/forget-password');
  }

  public successResponseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {

    let data: GoogleSuccessResponse = response as GoogleSuccessResponse;
    const user: SocialNetworksUser = {
      email: data.profileObj.email,
      language: getCurrentLanguageFromLocalStorage(),
      name: data.profileObj.name,
      accessToken: data.accessToken,
    };

    this.props.socialNetworksLogin(user);
  }

  public errorResponseGoogle = (response: GoogleErrorResponse) => {
    console.log(response);
  }

  public responseFacebook = (response: ReactFacebookLoginInfo) => {
    console.log(response);
    const user: SocialNetworksUser = {
      email: response.email,
      language: getCurrentLanguageFromLocalStorage(),
      name: response.name,
      accessToken: response.accessToken,
    };

    this.props.socialNetworksLogin(user);
  }

  public successResponseVk = (response: VkSuccessResponse, email:string) => {
    console.log(response);
    const user: SocialNetworksUser = {
      email: email,
      language: getCurrentLanguageFromLocalStorage(),
      name: response.first_name + ' ' + response.last_name,
      accessToken: response.hash,
    };

    this.props.socialNetworksLogin(user);
  }

  public handleCloseVkDialog = () => {
    this.setState({ isVkDialogOpen: false });
  }

  public handleOpenVkDialog = () => {
    this.setState({ isVkDialogOpen: true });
  }

  public render(): JSX.Element {
    const {
      children
    } = this.props;

    const {
      email,
      password,
      isEmailValid,
      isPasswordValid,
      touched,
      emailErrors,
      passwordErrors,
      isVkDialogOpen
    } = this.state;

    return (
      <I18n>{(t) => (
        <div className='ca-login-form'>
          {children}
          <form onSubmit={this.onSubmit} className='ca-login-form__container'>
            <FormGroup>
              <TextField
                id='email'
                label={t('emailLabel')}
                name='email'
                value={email}
                onChange={this.onChangeEmail}
                type='email'
                onBlur={this.onBlur('email')}
                error={!isEmailValid && touched.email}
              />
              {!isEmailValid &&
                touched.email &&
                emailErrors.map((err, index) => {
                  return (
                    <div className='ca-login-form__error' key={index}>
                      {t(err)}
                    </div>
                  );
                })}
            </FormGroup>

            <FormGroup>
              <TextField
                className='ca-login-form__password-field'
                style={{ marginTop: '20px' }}
                id='password'
                label={t('passwordLabel')}
                name='password'
                value={password}
                onChange={this.onChangePassword}
                type='password'
                onBlur={this.onBlur('password')}
                error={!isPasswordValid && touched.password}
              />
              {!isPasswordValid &&
                touched.password &&
                passwordErrors.map((err, index) => {
                  return (
                    <div className='ca-login-form__error' key={index}>
                      {t(err)}
                    </div>
                  );
                })}
            </FormGroup>
            <div className='ca-login-form__button-container'>
              <CaButton
                color='primary'
                type='submit'
                className='ca-login-form__login-btn'
                disabled={!isEmailValid || !isPasswordValid}
              >
                {t('login').toUpperCase()}
              </CaButton>
            </div>
            <div className='ca-login-form__form-text'>{t('loginWithSocialNetwork')}</div>
            <div className='ca-login-form__socials-btn'>
              <div className='ca-login-form__socials-btn-container'>
                {/* isn't work without https on public host, and work on local host with http */}
                <FacebookLogin
                  appId='328331921069724'
                  fields='name,email'
                  callback={this.responseFacebook}
                  cssClass='ca-login-form__facebook-btn'
                  textButton=''
                  icon='ca-login-form__custom-facebook'
                />
                <div className='ca-login-form__google-btn'>
                  <GoogleLogin
                    className='ca-login-form__custom-google'
                    tag='i'
                    buttonText=''
                    clientId='227700117302-q4uvo0fsvcujktrdaim4cta15chs1lgv.apps.googleusercontent.com'
                    onSuccess={this.successResponseGoogle}
                    onFailure={this.errorResponseGoogle}
                  />
                </div>
                <div
                  className='ca-login-form__vk-btn'
                  onClick={this.handleOpenVkDialog}
                >
                  <i className='ca-login-form__custom-vk'></i>
                </div>
                <VkDialog
                  className={'ca-login-form__vk-dialog'}
                  open={isVkDialogOpen}
                  onClose={this.handleCloseVkDialog}
                  onSuccess={
                    (response: VkSuccessResponse, email: string) =>
                        this.successResponseVk(response, email)
                  }
                >
                </VkDialog>
              </div>
            </div>
            <div className='ca-login-form__form-linked-text' onClick={() => this.redToForgetPassword()}>
              {t('forgot-password')}
            </div>
            <div className='ca-login-form__form-linked-text' onClick={() => this.redToRegistratePage()}>
              {t('register')}
            </div>
          </form>
        </div>
      )
      }
      </I18n>
    );
  }

  private validateEmail(email: string): boolean {
    return emailRegExp.test(email);
  }

  private removeElFromArrByValue(arr: string[], value: string): string[] {
    const index = arr.indexOf(value);
    if (index) {
      arr.splice(index, 1);
    }

    return arr;
  }
}

const mapStateToProps = (state: AppState) => ({
  status: state.auth.status,
  errors: state.errors,
  isSnackbarOpen: state.snackbarUi.isOpen
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginUser: (user: UserFieldsToRegister) => dispatch(new LoginUser(user)),
  socialNetworksLogin: (socialNetworksUser: SocialNetworksUser) => dispatch(new SocialNetworksLogin(socialNetworksUser))
});

export const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormComponent);
