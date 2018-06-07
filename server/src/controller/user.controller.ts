import { controller, httpPost, httpGet } from 'inversify-express-utils';
import { Request } from 'express';
import { Response } from 'express';
import { inject } from 'inversify';
import { 
  UserAuthenticationRepository,
  UserAuthenticationRepositoryImplementation 
} from '../service/user-authentication';


import { validateRegisterInput } from './../validation/register';
import { validateLoginInput } from './../validation/login';

import * as passport from 'passport';
import { IUser } from './../../Interfaces/IUser';


@controller('/api/users')
export class UserController {

  constructor(@inject(UserAuthenticationRepository) private userAuthenticationRepository: UserAuthenticationRepository) { }

  @httpPost('/register')
  public postRegister(request: Request, response: Response):  Promise<Response | IUser> | Response {
    

    const { errors, isValid } = validateRegisterInput(request.body);
    if (!isValid) {
      return response.status(400).json(errors);
    }

    return this.userAuthenticationRepository.registerUser(request.body)
    .catch((err) => { 
      return response.status(400).json(err); 
    });
  }

  @httpPost('/login')
  public postLogin(request: Request, response: Response): Promise<Response | {success: boolean, token: string}> | Response {
    
    const { errors, isValid } = validateLoginInput(request.body);
    if (!isValid) {
      return response.status(400).json(errors);
    }

    return this.userAuthenticationRepository.loginUser(request.body)
    .catch((err) => { 
      return response.status(400).json(err); 
    });
  }

  @httpGet('/')
  public getUsers(request: Request): Promise<string[]> {
    let ur = new UserAuthenticationRepositoryImplementation();

    return ur.getUsers();
  }

  @httpGet('/current', passport.authenticate('jwt', {session: false}))
  public getCurrentUser(request: Request, response: Response): Response {
    const { user } = request;
    if (user) {
      return response.json({
        id: user.id,
        name: user.name,
        email: user.email
      });  
    } else {
      return response.json({error: true});  
    }
  }
}
