import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default class UserController {

  public addNewUser(req: Request, res: Response) {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    newUser.save()
      .then(() => newUser.generateAuthToken())
      .then(token => res.header('x-auth', token).send(newUser))
      .catch(error => res.status(400).send(error));
  }

  public loginWithUser(req: Request, res: Response) {
    User.findByCredentials(req.body.email, req.body.password)
      .then(user => user.generateAuthToken()
        .then(token => res.header('x-auth', token).send(user))
      )
      .catch(e => res.status(400).send());
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth');

    User.findByToken(token)
      .then(user => {
        if (!user) {
          console.log('no user')
          return Promise.reject();
        }

        req.body.user = user;
        req.body.token = token;
        next();
      })
      .catch(error => {
        console.log('error', error)
        res.status(401).send();
      });
  }

}
