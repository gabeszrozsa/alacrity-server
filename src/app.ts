import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import { Routes } from "./routes/routes";

class App {
  public app: express.Application;
  public route: Routes = new Routes();
  public mongoUrl: string = 'mongodb://localhost/Astro';

  constructor() {
    this.app = express();
    this.config();
    this.route.routes(this.app);
    this.mongoSetup();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());

    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    const options =  { useNewUrlParser: true };
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, options).then(
      () => console.log('[SUCCESS] - Connected to MongoDB.'),
      err => console.log('[ERROR] - Cannot connect to MongoDB!')
    )
  }

}

export default new App().app;
