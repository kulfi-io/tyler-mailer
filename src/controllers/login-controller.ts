import Result from '../models/result';
import { BaseController } from './base-controller';
import { IResetRequest } from '../models/interfaces';
import { MAILER } from '../db/db-enums';
import { Request, Response } from 'express';

export class LoginController extends BaseController {
    constructor() {
        super();
    }

    resetRequest = (req: Request, res: Response) => {

        if (
            !req.body.email && !req.body.username
            && !req.body.firstname && !req.body.lastname
            && !req.body.token

        ) {
            return res.status(400).send({ message: MAILER.MISSING_REQUIRED_ITEMS });
        }

        const _resetRequest: IResetRequest = {
            username: this.decryptIv(req.body.username),
            email: this.decryptIv(req.body.email),
            firstname: this.decryptIv(req.body.firstname),
            lastname: this.decryptIv(req.body.lastname),
            token: req.body.token,
        }


        this.Email.send({
            template: 'password-reset',
            message: {
                from: this.mail.overrideEmail
                    ? this.mail.passiveTarget
                    : this.mail.sender,
                to: this.mail.overrideEmail
                    ? `${this.mail.sender}; ${this.mail.passiveTarget}`
                    : `${this.mail.sender}; ${_resetRequest.email}`
            },
            locals: {
                email: _resetRequest.email,
                name: _resetRequest.username,
                token: _resetRequest.token
            }
        })
            .then((result: Result) => {
                res.status(200).send({ message: MAILER.REQUEST_SENT });
            })
            .catch((err: Error) => {
                res.status(400).send({ message: err.message });
            });
    }
}

export default new LoginController();

