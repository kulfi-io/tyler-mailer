import * as mongoose from "mongoose";

export interface IVerify extends mongoose.Document {
    userid: string;
    username: string;
    email: string;
    result: string;
}

export interface IDecoded {
    id: string;
    fdnq: string;
    address: string;
    exp: number;
    iat: number;
}

export interface IMail {
    service: string; 
    sender: string; 
    user: string; 
    pass: string; 
    preview: boolean; 
    send: boolean; 
    templates: string[]; 
}

export interface IApiUser extends mongoose.Document {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    salt: string;
    password_hash: string;
    userTypeId: mongoose.Types.ObjectId;
    active: boolean;
    tokenValidated: boolean;
    validationToken: string;
}

export interface IValidClient extends mongoose.Document {
    id: string;
    ipAddress: string;
    name: string;
    description: string;
    contactName: string;
    email: string;
    phoneNumber: number;
    token: string;
    active: boolean;
}