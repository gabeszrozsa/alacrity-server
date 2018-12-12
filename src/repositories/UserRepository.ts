import User from '../models/User';
import { ICurrentUser, IUser, ILoginUser } from '../entities';

export default class UserRepository {

  public static logOut(user, token: string) {
    return new Promise((resolve, reject) => {
      user.removeToken(token)
      .then(() => resolve())
      .catch(error => {
        console.log('[ERROR] - UserRepository :: logOut');
        console.log('user | ', user);
        console.log('token | ', token);
        console.log(error);
        reject(error);
      })
    });
  }

  public static getCurrent(user) {
    return new Promise((resolve, reject) => {
      try {
        const { _id, email, displayName, token } = user;
        const currentUser: ICurrentUser = { _id, email, displayName, token };
  
        resolve(currentUser);
      } catch (error) {
          console.log('[ERROR] - UserRepository :: getCurrent');
          console.log('user | ', user);
          console.log(error);
          reject(error);
      }
    });
  }

  public static addNewUser(user) {
    return new Promise((resolve, reject) => {
      const newUser = new User(user);
  
      newUser.save()
        .then(() => newUser.generateAuthToken())
        .then(token => {
          const { _id, displayName, email } = newUser;
          const user: ICurrentUser = { _id, displayName, email, token };
          resolve({ token, user })
        })
        .catch(error => {
          console.log('[ERROR] - UserRepository :: addNewUser');
          console.log('user | ', user);
          console.log(error);
          reject(error);
        });
    });
  }

  public static getAllUsers() {
    return new Promise((resolve, reject) => {
      User
        .find({})
        .exec()
        .then((result) => {
          const users: IUser[] = result
            .map(u => <IUser>{ _id: u._id, displayName: u.displayName, email: u.email });
            
          resolve(users);
        })
        .catch(error => {
          console.log('[ERROR] - UserRepository :: getAllUsers');
          console.log(error);
          reject(error)
        });
    });
  }

  public static loginWithUser(loginUser: ILoginUser) {
    return new Promise((resolve, reject) => {

      User.findByCredentials(loginUser)
      .then(user => user.generateAuthToken()
        .then(token => {
          const { _id, displayName, email } = user;
          const currentUser: ICurrentUser = { _id, displayName, email, token };
          resolve({ token, currentUser });
        })
      )
      .catch(error => {
        console.log('[ERROR] - UserRepository :: loginWithUser');
        console.log('loginUser | ', loginUser);
        console.log(error);
        reject(error)
      });

    });
  }

  public static authenticate(token: string) {
    return new Promise((resolve, reject) => {
      User.findByToken(token)
        .then(user => {
          if (!user) {
            console.log('[ERROR] UserRepository :: authenticate: no user with token', token);
            reject();
          }

          resolve(user);
        })
        .catch(error => {
          console.log('[ERROR] - UserRepository :: authenticate');
          console.log('token | ', token);
          console.log(error);
          reject(error)
        });
    });
  }
}