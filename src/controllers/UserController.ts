import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { ICurrentUser, IUser, IRegisterUser, ILoginUser } from 'entities';

export default class UserController {
  public logOut(req: Request, res: Response) {
    req.body.user.removeToken(req.body.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  }

  public getCurrent(req: Request, res: Response) {
    const { _id, email, displayName, token } = req.body.user;
    const currentUser: ICurrentUser = { _id, email, displayName, token };
    res.send(currentUser);
  }

  public addNewUser(req: Request, res: Response) {
    const registerUser: IRegisterUser = {
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName
    };

    const newUser = new User(registerUser);

    newUser.save()
      .then(() => newUser.generateAuthToken())
      .then(token => {
        const { _id, displayName, email } = newUser;
        const user: ICurrentUser = { _id, displayName, email, token };

        res.header('x-auth', token).send(user);
      })
      .catch(error => res.status(400).send(error));
  }

  public getAllUsers(req: Request, res: Response) {
    User.find({}, (err, result) => {
      if(err){
          res.send(err);
      }

      const users = result.map(u => (<IUser>{ _id: u._id, displayName: u.displayName, email: u.email }));
      res.json(users);
    });
  }

  public loginWithUser(req: Request, res: Response) {
    const loginUser: ILoginUser = {
      email: req.body.email, 
      password: req.body.password
    };

    User.findByCredentials(loginUser)
      .then(user => user.generateAuthToken()
        .then(token => {
          const { _id, displayName, email } = user;
          const currentUser: ICurrentUser = { _id, displayName, email, token };
          res.header('x-auth', token).send(currentUser)
        })
      )
      .catch(e => res.status(400).send());
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth');
    User.findByToken(token)
      .then(user => {
        if (!user) {
          console.log('[ERROR] UserController -> authenticate: no user with token', token);
          return Promise.reject();
        }

        req.body.user = user;
        req.body.token = token;
        next();
      })
      .catch(error => res.status(401).send());
  }

}
