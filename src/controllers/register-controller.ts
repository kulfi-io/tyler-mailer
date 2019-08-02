import { BaseController } from './base-controller';
import { Request, Response } from "express";
import Result from '../models/result';
import Verify from '../models/verify';

export class RegisterController extends BaseController {
    private verify: Verify = {}
    constructor() {
        super();
    }

    send = (req: Request, res: Response) => {
        if (
            !req.body.userId ||
            !req.body.username ||
            !req.body.email ||
            !req.body.token
        ) {
            return res.status(400).send({ message: "missing data item(s)" });
        }

        this.verify.email = this.decryptData(req.body.email);
        this.verify.token = req.body.token;
        this.verify.username = this.decryptData(req.body.username);
        this.verify.userId = this.decryptData(req.body.userId);


        this.Email.send({
            template: 'register',
            message: {
                to: this.mail.overrideProd
                    ? this.mail.passiveSender 
                    : this.mail.sender
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

export default new RegisterController();

