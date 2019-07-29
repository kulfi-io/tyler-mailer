import { ConnectionOptions } from "mongoose";

export class ConnOptions implements ConnectionOptions {
    
    useNewUrlParser: boolean = true;
    useCreateIndex: boolean = true;
    useFindAndModify: boolean = false;
    autoIndex: boolean = false; // Don't build indexes
    autoReconnect: boolean = true;
    reconnectTries: number = Number.MAX_VALUE; // Never stop trying to reconnect
    reconnectInterval: number = 500; // Reconnect every 500ms
    poolSize: number = 10; // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: number = 0;
    connectTimeoutMS: number = 10000; // Give up initial connection after 10 seconds
    socketTimeoutMS: number = 45000; // Close sockets after 45 seconds of inactivity
    user: string = '';
    pass: string = '';
    dbName: string = '';
}

export default new ConnOptions();
