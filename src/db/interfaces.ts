import * as mongoose from "mongoose";
import options from './conn-options';

export interface MongooseElement {
    connection: mongoose.Connection;
    instance: Promise<typeof mongoose>;
    options: options;
    endpoint: string;
    base: mongoose.Mongoose;

}

