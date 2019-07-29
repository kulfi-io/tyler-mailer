import { connect, connection, Connection, ConnectionOptions } from 'mongoose';
import {Verify, VerifyModel} from '../models/verification';
import ConnOptions from '../db/conn-options';
import { mailer } from '../config/config.json';
import {CONN} from '../db/db-enums';

declare interface IModels {
    Verify: VerifyModel
}

export class MailerDB {
    private static instance: MailerDB;
    private options: ConnectionOptions;
    private endpoint: string;


    private _db: Connection;
    private _models: IModels;

    private constructor() {

        this.options = ConnOptions;
        this.options.user = mailer.user;
        this.options.pass = mailer.pass;
        this.options.dbName = mailer.db
        this.endpoint = `${mailer.endpoint}/${mailer.db}`;
        
        connect(this.endpoint, this.options);
        this._db = connection;
        this._db.on("open", this.connected);
        this._db.on("error", this.error);

        this._models = {
            Verify: new Verify().model
            // this is where we initialise all models
        }

    }

    public static get Models() {
        if (!MailerDB.instance) {
            MailerDB.instance = new MailerDB();
        }
        return MailerDB.instance._models;
    }

    private connected = () => {
        console.info(CONN.CONNECTED);
    }

    private error = () => {
        console.error(CONN.CONNECTED);
    }

}