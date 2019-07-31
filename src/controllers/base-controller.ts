import * as mailer from 'nodemailer';
import * as config from '../config/config.json';
import * as crypto from 'crypto-js';
import * as aws from 'aws-sdk';
import { IMail } from 'src/models/interfaces.js';
import * as Email from 'email-templates';
import { MailerDB } from '../controllers/mailer-db-controller';
import Verify from '../models/verify';


const Mail = require('mail');

export class BaseController {
    protected transporter: typeof Mail;
    protected mail: IMail;
    protected transportSecret: string;
    protected Email: Email;

    constructor() {
        this.mail = config.mail;
        this.transportSecret = config.transportSecret;

        const _options = {
            "accessKeyId": this.mail.user,
            "secretAccessKey": this.mail.pass,
            "region": "us-west-2"
        }

        this.transporter = mailer.createTransport({
            SES: new aws.SES(_options)
        });

        this.Email = new Email({
            message: {
                from: this.mail.sender
            },
            preview: this.mail.preview,
            transport: this.transporter,
            send: this.mail.send,
           
        });

    }

    protected insertSentEmailResponse = (verify: Verify) => {

        let _model = new MailerDB.Models.Verify(
            {
                userid: 'test-user',
                username: verify.username,
                email: verify.email,
                result: verify.result,
            }
        );

        MailerDB.Models.Verify.create(_model, (err: Error, data: Verify) => {
            if (err) console.error({message: err.message});
        });
    }

    protected encryptData(data: string): string {
        var _data = crypto.AES.encrypt(data, this.transportSecret);
        return _data.toString();
    }

    protected decryptData(data: string): string {
        var _data = crypto.AES.decrypt(data, this.transportSecret);
        var _plaintext = _data.toString(crypto.enc.Utf8);
        return _plaintext;
    }
}

export default new BaseController();