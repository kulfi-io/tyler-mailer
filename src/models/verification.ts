import {Schema, model, Document, Model } from 'mongoose';

declare interface IVerify extends Document {
    userId: string;
    username: string;
    email: string;
    result: string;
}

export interface VerifyModel extends Model<IVerify>{}

export class Verify {
    private _model: Model<IVerify>

    constructor() {
        const schema = new Schema({
            userId: {
                type: String,
                index: true,
                required: [true, "is required"]
            },
            username: {
                type: String,
                index: true,
                required: [true, "is required"]
            },
            email: {
                type: String,
                lowercase: true,
                required: [true, "is required"],
                match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "is invalid"],
                index: true
            },
            result: {
                type: String,
                lowercase: true,
                required: [true, "is required"],
                unique: true,
                index: true
                },
        },
        { timestamps: true }
        );

        this._model = model<IVerify>('verifications', schema);
    }

    public get model(): Model<IVerify> {
        return this._model
    }
}