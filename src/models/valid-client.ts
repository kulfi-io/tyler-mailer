import * as config from '../config/config.json';
import * as jwt from 'jsonwebtoken';
import * as validator from 'mongoose-unique-validator';
import {
    Document,
    model,
    Model,
    Schema
    } from 'mongoose';

declare interface IValidClient extends Document {
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

export interface ValidClientModel extends Model<IValidClient>{}

export class ValidClient {
    private _model: Model<IValidClient>

    constructor() {
        const schema = new Schema({
            id: {
                type: String,
                index: true,
                required: [true, "is required"]
            },
            ipAddress: {
                type: String,
                required: [true, "is required"],
                validate: [
                /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                "is invalid"
                ],
                index: true
            },
            name: {
                type: String,
                required: [true, "is required"],
                lowercase: true,
                unique: true
            },
            description: {
                type: String,
                required: [true, "is required"]
            },
            contactName: {
                type: String,
                required: [true, "is required"]
            },
            email: {
                type: String,
                lowercase: true,
                required: [true, "is required"],
                validate: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "is invalid"],
                index: true
            },
            phoneNumber: {
                type: String,
                required: [true, "is required"],
                validate: [
                /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                "is invalid"
                ],
                index: true
            },
            token: {
                type: String,
                index: true
            },
            active: {
                type: Boolean,
                retuired: true,
                required: [true, "is required"]
            }
        },
        { timestamps: true }
        );

        schema.plugin(validator, { message: "is already taken" });
        schema.methods.generateValidationToken = function() {
            
            const today = new Date();
            let _exp = new Date(today);
            _exp.setDate(today.getFullYear() + 5);

            try {
                const _token = jwt.sign(
                    {
                        id: this._id,
                        address: this.ipAddress,
                        exp: _exp.getTime()
                    },
                    config.secret
                );
        
                this.token = _token;
                return _token;

            } catch {
                return null;
            }
        }

        this._model = model<IValidClient>('ValidClients', schema);
    }

    public get model(): Model<IValidClient> {
        return this._model
    }
}