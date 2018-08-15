import { controller, httpPost } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';

import { UserAuthenticationRepository } from '../service/user-authentication';

import { validateRegisterInput } from '../validation/register';
import { validateLoginInput } from '../validation/login';

import { User } from '../../Interfaces/User';

@controller('/api/users')
export class UserController {

    constructor(@inject(UserAuthenticationRepository) private userAuthenticationRepository: UserAuthenticationRepository) {
    }

    @httpPost('/register')
    public postRegister(request: Request, response: Response): Promise<Response | User> | Response {
        const { errors, isValid } = validateRegisterInput(request.body);

        if (!isValid) {
            return response.status(400).json(errors);
        }
        return this.userAuthenticationRepository.registerUser(request.body)
            .catch((error) => {
                return error.code >= 2000 ?
                    response.status(500).json(error) :
                    response.status(400).json(error);
            });
    }

    @httpPost('/login')
    public postLogin(request: Request, response: Response): Promise<Response | { success: boolean, token: string }> | Response {
        const { errors, isValid } = validateLoginInput(request.body);

        if (!isValid) {
            return response.status(400).json(errors);
        }

        return this.userAuthenticationRepository.loginUser(request.body)
            .catch((error) => {
                return error.code >= 2000 ?
                    response.status(500).json(error) :
                    response.status(400).json(error);
            });
    }

    @httpPost('/user-language')
    public async userLanguage(request: Request, response: Response): Promise<Response> {
        const userEmail: string = request.body.userEmail;
        const userLanguage: string = request.body.userLanguage.toLowerCase();

        const result = await this.userAuthenticationRepository.setUserLanguage(userEmail, userLanguage);
        if (result) {
            return response.sendStatus(200);
        } else {
            return response.sendStatus(400);
        }
    }

    @httpGet('/get-user-language')
    public async getUserLanguage(request: Request, response: Response): Promise<Response> {
        const userEmail: string = request.query.email;
        try {
            const language = await this.userAuthenticationRepository.getUserLanguage(userEmail);
            return response.status(200).send(language);
        } catch (error) {
            return response.status(400).send(error.message);
        }
    }
}
