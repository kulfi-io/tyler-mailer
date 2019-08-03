import * as express from 'express';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import MailerRouter from './routes';
import * as config from './config/config.json';
import { ValidateRequest } from './middleware/validate-request';

export class App {
  private server: express.Application;
  
  constructor() {

    process.title = "tyler-mailer";
    this.server = express();
    this.configureMiddleware();
    this.routes();
    this.run(config.port, config.host);
  }

  private configureMiddleware() {

    this.server.use(logger('dev'));
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json()); 
    this.server.use(helmet());
    this.server.disable('x-powered-by');
    this.server.all('/*', cors());
    // this.server.all('/v1/*', ValidateRequest.validate);

  }

  private routes() {
    
    const router = express.Router();
    MailerRouter.map(router);

    this.server.use(router);
    
  }

  public run(port: number, host: string) {
    this.server.listen(port, host, () => {
      console.log(`listening on port: ${port}`);
      console.log(`ENV: ${process.env.NODE_ENV}`);
    });
  }

}

export default new App();