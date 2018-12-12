import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { ICurrentUser, IUser, IRegisterUser, ILoginUser } from 'entities';
import { UserRepository } from '../repositories';

export default class UserController {
  public logOut(req: Request, res: Response) {
    UserRepository.logOut(req.body.user, req.body.token)
      .then(() => res.status(200).send())
      .catch((error) => res.status(400).send(error))
  }

  public getCurrent(req: Request, res: Response) {
    UserRepository.getCurrent(req.body.user)
      .then((currentUser) => res.send(currentUser))
      .catch((error) => res.status(400).send(error))
  }

  public addNewUser(req: Request, res: Response) {
    const registerUser: IRegisterUser = {
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName
    };

    UserRepository.addNewUser(registerUser)
      .then(({ token, user }) => res.header('x-auth', token).send(user))
      .catch(error => res.status(400).send(error));
  }

  public getAllUsers(req: Request, res: Response) {
    
    UserRepository.getAllUsers()
      .then((users) => res.json(users))
      .catch(error => res.status(400).send(error));
  }

  public loginWithUser(req: Request, res: Response) {
    const loginUser: ILoginUser = {
      email: req.body.email, 
      password: req.body.password
    };

    UserRepository.loginWithUser(loginUser)
      .then(({ token, currentUser }) => res.header('x-auth', token).send(currentUser))
      .catch(error => res.status(400).send(error));
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth');
    UserRepository.authenticate(token)
      .then(user => {
        req.body.user = user;
        req.body.token = token;
        next();
      })
      .catch(error => res.status(401).send());
  }

}
