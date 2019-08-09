import * as config from '../config/config.json';
import * as jwt from 'jsonwebtoken';
import { AccountDB } from '../controllers/account-db-controller';
import { IApiUser, IDecoded } from '../models/interfaces';
import { NextFunction, Request, Response } from 'express';
import { VERIFY } from './verify-enums';

export class ValidateRequest {
  static validate(req: Request, res: Response, next: NextFunction) {
    const token = (
      (req.body && req.body.access_token)
      || (req.query && req.query.access_token)
      || req.headers["x_access_token"]
    ).toString().trim();

    const address =
      req.headers && req.headers.forwarded
        ? req.headers.forwarded
        : req.connection.remoteAddress;

    if (!token || !address)
      return res.status(400).send({ message: VERIFY.INVALID_TOKEN_OR_ADDRESS });

    const _decoded = <IDecoded>jwt.verify(token, config.secret);

    if (!_decoded)
      return res.status(400).send({ message: VERIFY.DECODING_ERROR });

    if (_decoded.exp <= Date.now())
      return res.status(400).send({ message: VERIFY.TOKEN_EXPIRED });

    if (address !== _decoded.address)
      return res.status(400).send({ message: VERIFY.UNAUTHORIZED_ADDRESS });

    AccountDB.Models.ValidClient.findById(_decoded.id, (err: Error, data: IApiUser) => {

      if (err) return res.status(400).send(err.message);

      if (data && data.active) {
        return next();
      }

      return res.status(417).send({ message: VERIFY.INACTIVE_TOKEN })

    });

  }
}

export default new ValidateRequest();
