import dataAccess from '../db/data-access';
import * as mongoose from 'mongoose';
import { IVerify } from './interfaces';

export class VerificationSchema  {
  userId?: mongoose.Types.ObjectId;
  username?: string;
  email?: string;
  sent?: Date;
  result?: string;

  public get schema(): mongoose.Schema {
    const _schema = new mongoose.Schema(
      {
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

    return _schema;
  }
}

const model = dataAccess.mailerElement.connection.model<IVerify>(
  "verifications",
  new VerificationSchema().schema
);
export default model;
