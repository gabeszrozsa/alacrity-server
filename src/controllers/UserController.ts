import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default class UserController {

  public addNewUser(req: Request, res: Response) {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName
    });

    newUser.save()
      .then(() => newUser.generateAuthToken())
      .then(token => {
        const { _id, displayName, email } = newUser;
        const user = { _id, displayName, email, token };

        res.header('x-auth', token).send(user);
      })
      .catch(error => res.status(400).send(error));
  }

  public getAllUsers(req: Request, res: Response) {
    User.find({}, (err, result) => {
      if(err){
          res.send(err);
      }

      const users = result.map(u => ({ _id: u._id, displayName: u.displayName, email: u.email }));
      res.json(users);
    });
  }

  public loginWithUser(req: Request, res: Response) {
    User.findByCredentials(req.body.email, req.body.password)
      .then(user => user.generateAuthToken()
        .then(token => {
          const { _id, displayName, email } = user;
          const currentUser = { _id, displayName, email, token };
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
          console.log('no user')
          return Promise.reject();
        }

        req.body.user = user;
        req.body.token = token;
        next();
      })
      .catch(error => res.status(401).send());
  }

}
