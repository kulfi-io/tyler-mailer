import * as mongoose from 'mongoose';
import * as config from '../config/config.json';
import { MongooseElement } from './interfaces';
import options from './conn-options';
import { CONN } from './db-enums.js';


export class DataAccess {

    static accountElement: MongooseElement;
    static mailerElement: MongooseElement;

    static accountConnect() {

        const _config = config.account;
        this.accountElement.base = new mongoose.Mongoose();
        this.accountElement.options = new options();

        const _element = this.accountElement;


        _element.options.user = _config.user;
        _element.options.pass = _config.pass;
        _element.options.dbName = _config.db;
        _element.endpoint = `${_config.endpoint}/${_config.db}`;


        const connection = () => {
            return new Promise((resolve, reject) => {

                const establish = (instance: Promise<typeof mongoose>) => {
                    const _conn = _element.base.connect(_element.endpoint
                        , _element.options);
          
                    if (_conn) {
                      reject(CONN.FAILURE);
                    } else {
                      instance = _conn;
                      resolve(CONN.CONNECTED);
                    }
                };

                _element.connection = _element.base.connection;
                _element.connection.once("open", () => {
                  console.log(CONN.CONNECTED);
                });
        
                _element.connection.on("error", err => {
                  console.error(
                    `${CONN.ERROR} ${err} error`
                  );
                });

                _element.connection.once("disconnected", () => {
                    console.log(CONN.DISCONNECTED);
                    establish(_element.instance);
                });
          
                _element.base.connection.once("reconnected", () => {
                    console.log(CONN.RECONNECTED);
                });
        
                process.on("SIGINT", () => {
                    _element.connection.close(() => {
                        console.log("db connection", CONN.CLOSED);
                    });
                });

                establish(_element.instance);
            });
        }

        if (this.accountElement.connection) {
            return this.accountElement.instance;
        } else {
            connection()
            .then(() => {
                this.accountElement = _element;
                return this.accountElement.instance;
            })
            .catch((err: Error) => {
                return err;
            });
        }
    }

    static mailerConnect() {

        const _config = config.mailer;
        this.mailerElement.base = new mongoose.Mongoose();
        this.mailerElement.options = new options();

        const _element = this.mailerElement;

        _element.options.user = _config.user;
        _element.options.pass = _config.pass;
        _element.options.dbName = _config.db;
        _element.endpoint = `${_config.endpoint}/${_config.db}`;

        const connection = () => {
            return new Promise((resolve, reject) => {

                const establish = (instance: Promise<typeof mongoose>) => {
                    const _conn = _element.base.connect(_element.endpoint
                        , _element.options);
          
                    if (_conn) {
                      reject("DB account connection failure");
                    } else {
                      instance = _conn;
                      resolve("connected to account");
                    }
                };

                _element.connection = _element.base.connection;
                _element.connection.once("open", () => {
                  console.log("Connected to account db");
                });
        
                _element.connection.on("error", err => {
                  console.error(
                    `Mongoode account connection has occured  ${err} error`
                  );
                });

                _element.connection.once("disconnected", () => {
                    console.log("Mongoose account connection disconnected");
                    establish(_element.instance);
                });
          
                _element.base.connection.once("reconnected", () => {
                    console.log("Mongoose account connection reconnected");
                });
        
                process.on("SIGINT", () => {
                    _element.connection.close(() => {
                        console.log("db connection", "Mongoose account connection");
                    });
                });


                establish(_element.instance);
            });
        }

        if (this.mailerElement.connection) {
            return this.mailerElement.instance;
        } else {
            connection()
            .then(() => {
                this.mailerElement = _element;
                return this.mailerElement.instance;
            })
            .catch((err: Error) => {
                return err;
            });
        }
    }

}

DataAccess.accountConnect();
DataAccess.mailerConnect();
export default DataAccess;
