// import User from '../models/user';
// import { Request, Response, NextFunction } from "express";
//
// export default function authenticate(req: Request, res: Response, next: NextFunction) {
//   const token = req.header('x-auth');
//   console.log(token)
//
//   User.findByToken(token).then(user => {
//     console.log(user)
//   //   if (!user) {
//   //     return Promise.reject();
//   //   }
//   //
//   //   req.body.user = user;
//   //   req.body.token = token;
//   //   next();
//   // })
//   // .catch(error => {
//   //   res.status(401).send();
//   });
// };
//# sourceMappingURL=authenticate.js.map