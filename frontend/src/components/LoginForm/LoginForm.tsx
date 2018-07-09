import './LoginForm.scss';

import { Button, FormGroup, TextField } from '@material-ui/core';

import * as React from 'react';
import { connect } from 'react-redux';

import { emailRegExp, frontEndValidationErrorsLogin } from 'constes';
import { AppState, LoginUser } from 'store';

import { AuthStatus, UserFieldsToLogin, UserFieldsToRegister } from 'models';
import { isEmpty } from './../../utils/isEmpty';

import {
  initLoginFormState,
  LoginFormProps,
  LoginFormState
} from './LoginForm.model';
import Slide from '@material-ui/core/Slide';

import { CaSnackbar } from './../Snackbar/Snackbar';

export class LoginFormComponent extends React.Component<
  LoginFormProps,
  LoginFormState
> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = initLoginFormState;

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
  }


  public componentWillReceiveProps(nextProps: LoginFormProps): void {
    if (nextProps.status === AuthStatus.AUTHORIZED) {
      this.props.history.push('/homepage');
    }

    if (!isEmpty(nextProps.errors)) {
      this.setState({isSnackOpen: true})
    }
  }

  public componentDidMount(): void {
    if (this.props.status === AuthStatus.AUTHORIZED) {
      this.props.history.push('/homepage');
    }
  }

  public onChange(event: any): void {
    const target = event.target;

    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value } as LoginFormState);
  }

  public onSubmit(event: any): void {
    event.preventDefault();

    const user: UserFieldsToLogin = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  }

  public checkValidation(): void {
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

  public onBlur = (field: string) => (evt: any) => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    });
    this.checkValidation();
  };

  public transitionUp(props: any): JSX.Element {
    return <Slide {...props} direction="up" />;
  }

  public closeSnackbar(): void{

    this.setState({
      isSnackOpen: false
    })
  }

  public render(): JSX.Element {
    const { errors } = this.props;
    const keys = errors && Object.keys(errors);
    return (
      <div className="ca-login-form">
      <CaSnackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={ this.state.isSnackOpen }
          autoHideDuration = {4000}
          handleClose= {() => this.closeSnackbar()}
          type="error"
          TransitionComponent = {this.transitionUp}
          message={
            <div>
              {keys && keys.map((k: string) => 
                (
                  <div>* {errors[k].msg} </div>
                )
              )}
            </div>
          }
        />

      {this.props.children}
        <form onSubmit={this.onSubmit} className="ca-login-form__container">
          <FormGroup>
            <TextField
              id="email"
              label="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              type="email"
              onBlur={this.onBlur('email')}
              error={!this.state.isEmailValid && this.state.touched.email}
            />
            {!this.state.isEmailValid &&
              this.state.touched.email &&
              this.state.emailErrors.map((err, index) => {
                return (
                  <div className="ca-login-form__error" key={index}>
                    {err}
                  </div>
                );
              })}
          </FormGroup>

          <FormGroup>
            <TextField
              className="ca-login-form__password-field"
              id="password"
              label="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              type="password"
              onBlur={this.onBlur('password')}
              error={!this.state.isPasswordValid && this.state.touched.password}
            />
            {!this.state.isPasswordValid &&
              this.state.touched.password &&
              this.state.passwordErrors.map((err, index) => {
                return (
                  <div className="CA-Registration-form__error" key={index}>
                    {err}
                  </div>
                );
              })}
          </FormGroup>

          <Button
            color="primary"
            type="submit"
            className="ca-login-form__login-btn"
            disabled={!this.state.isEmailValid || !this.state.isPasswordValid}
          >
            LOGIN
          </Button>
        </form>
      </div>
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
  errors: state.errors
});

const mapDispatchToProps = (dispatch: any) => ({
  loginUser: (user: UserFieldsToRegister) => dispatch(new LoginUser(user))
});

export const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormComponent);
