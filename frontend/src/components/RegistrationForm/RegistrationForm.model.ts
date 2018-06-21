import { AuthStatus, UserFieldsToRegister } from "models";

export interface RegistrationFormState {
    email: string;
    name: string;
    password: string;
    passwordToRepeat: string;
    isPasswordValid: boolean;
    isEmailValid: boolean;
    isNameValid: boolean;
    touched: {
        email: boolean;
        password: boolean;
        passwordToRepeat: boolean;
        name: boolean;
    };
    emailErrors: string[];
    passwordErrors: string[];
    nameErrors: string[];
}

export const initRegistrationFormState: RegistrationFormState = {
    email: "",
    name: "",
    password: "",
    passwordToRepeat: "",
    isPasswordValid: false,
    isEmailValid: false,
    isNameValid: false,
    touched: {
        email: false,
        password: false,
        passwordToRepeat: false,
        name: false
    },
    emailErrors: [],
    passwordErrors: [],
    nameErrors: []
};
export interface RegistrationFormProps {
    history: any;
    status: AuthStatus;
    registerUser(user: UserFieldsToRegister): void;
}
