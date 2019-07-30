import { BaseController } from './base-controller';
import { Request, Response } from "express";
import * as Email from 'email-templates';
import Result from '../models/result';
import Verify from '../models/verify';
import { MailerDB } from '../controllers/mailer-db-controller';
import * as path from 'path';



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

        // this.verify.email = this.decryptData(req.body.email);
        // this.verify.token = req.body.token;
        // this.verify.username = this.decryptData(req.body.username);
        // this.verify.userId = req.body.userId;

        this.verify.email = req.body.email;
        this.verify.token = req.body.token;
        this.verify.username = req.body.username;
        this.verify.userId = req.body.userId;

        const root = path.resolve(this.mail.root);
        
        const _email= new Email({
            views: {root},
            message: {
                from: this.mail.sender
            },
            preview: this.mail.preview,
            transport: this.transporter,
           
        });

        _email.send({
            template: 'register',
            message: {
                to: 'ashish@ashishc.io'
            },
            locals: {
                name: this.verify.username,
                token: this.verify.token,
                email: this.verify.email
            }
        })
        .then((result: Result) => {
            this.verify.result = result.messageId;
            // this.insertSentEmailResponse();
            res.status(200).send({ message: 'sent' });
        })
        .catch((err: Error) => {
            res.status(400).send({ message: err.message });
        });

    }

    private insertSentEmailResponse = () => {

        let _model = new MailerDB.Models.Verify(
            {
                userid: this.verify.userId,
                username: this.verify.username,
                email: this.verify.email,
                result: this.verify.result,
            }
        );

        MailerDB.Models.Verify.create(_model, (err: Error, data: Verify) => {
            if (err) console.error({message: err.message});
        });
    }
}

export default new RegisterController();

