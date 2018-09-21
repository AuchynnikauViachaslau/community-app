import { History } from 'history';

import { AuthStatus, UserFieldsToRegister, SocialNetworksUser } from 'models';

export interface RegistrationFormState {
  email: string;
  name: string;
  password: string;
  passwordToRepeat: string;
  isPasswordValid: boolean;
  isEmailValid: boolean;
  isNameValid: boolean;
  isSnackbarOpen: boolean;
  touched: {
    email: boolean;
    password: boolean;
    passwordToRepeat: boolean;
    name: boolean;
  };
  emailErrors: string[];
  passwordErrors: string[];
  nameErrors: string[];
  language: string;
  isVkDialogOpen: boolean;  
}

export const initRegistrationFormState: RegistrationFormState = {
  email: '',
  name: '',
  password: '',
  passwordToRepeat: '',
  isPasswordValid: false,
  isEmailValid: false,
  isNameValid: false,
  isSnackbarOpen: false,
  touched: {
    email: false,
    password: false,
    passwordToRepeat: false,
    name: false
  },
  emailErrors: [],
  passwordErrors: [],
  nameErrors: [],
  language: 'eng',
  isVkDialogOpen: false,  
};
export interface RegistrationFormProps {
  history: History;
  status: AuthStatus;

  language: string;  

  registerUser(user: UserFieldsToRegister): void;
  socialNetworksLogin(socialNetworksUser: SocialNetworksUser): void;
}
