import { BaseController } from './base-controller';
import { Request, Response } from "express";
import Result from '../models/result';
import Verify from '../models/verify';

export class UserController extends BaseController {
    private verify: Verify = {}
    constructor() {
        super();
    }

    registerAccount = (req: Request, res: Response) => {
        if (
            !req.body.userId ||
            !req.body.username ||
            !req.body.email ||
            !req.body.token
        ) {
            return res.status(400).send({ message: "missing data item(s)" });
        }

        this.verify.email = this.decryptIV(req.body.email);
        this.verify.token = req.body.token;
        this.verify.username = this.decryptIV(req.body.username);
        this.verify.userId = this.decryptIV(req.body.userId);

        this.Email.send({
            template: 'register',
            message: {
                to: this.mail.overrideEmail
                    ? this.mail.passiveTarget
                    : this.verify.email
            },
            locals: {
                name: this.verify.username,
                token: this.verify.token,
                email: this.verify.email
            }
        })
        .then((result: Result) => {
            this.verify.result = result.messageId;
            this.insertSentEmailResponse(this.verify);
            res.status(200).send({ message: 'sent' });
        })
        .catch((err: Error) => {
            res.status(400).send({ message: err.message });
        });
    }
}

export default new UserController();

