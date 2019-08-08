import * as mongoose from "mongoose";

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
    passiveTarget: string;
    overrideEmail: boolean;
    region: string;
}

export interface INote {
    
    email: string;
    firstname: string;
    lastname: string;
    content: string;
    fullname():string;
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

export interface IResetRequest {
    username: string,
    firstname: string,
    lastname: string,
    email: string;
    token: string;
}

