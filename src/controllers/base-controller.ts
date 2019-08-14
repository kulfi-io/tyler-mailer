import * as aws from 'aws-sdk';
import * as config from '../config/config.json';
import * as crypto from 'crypto';
import * as Email from 'email-templates';
import * as mailer from 'nodemailer';
import Verify from '../models/verify';
import { ENV } from '../db/db-enums';
import { IMail } from '../models/interfaces';
import { MailerDB } from '../controllers/mailer-db-controller';
import { Types } from 'mongoose';

const Mail = require('mail');

export class BaseController {
    protected transporter: typeof Mail;
    protected mail: IMail;
    protected transportSecret: string;
    protected Email: Email;
    protected isProd: boolean;
    private algorithm: string;

    constructor() {
        this.mail = config.mail;
        this.transportSecret = config.transportSecret;
        this.isProd = process.env.NODE_ENV === ENV.PROD;

        this.algorithm = 'aes192';

        const _options = {
            "accessKeyId": this.mail.user,
            "secretAccessKey": this.mail.pass,
            "region": this.mail.region,
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
                userId: verify.userId,
                username: verify.username,
                email: verify.email,
                result: verify.result,
            }
        );

        MailerDB.Models.Verify.create(_model, (err: Error, data: Verify) => {
            if (err) console.error({message: err.message});
        });
    }

    protected encrypt = (data: string): string => {

        const cipher = crypto.createCipher(this.algorithm, config.secret);

        let encrypted = '';
        encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return this.isProd ? encrypted : data;
    }

    protected decrypt = (data: string): string => {
        const decipher = crypto.createDecipher(this.algorithm, config.secret);

        let decrypted;
        decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf-8');

        return this.isProd ? decrypted : data;
    }

    protected mongoIdObject(data: string) {
        var _id = Types.ObjectId(data);
        return _id;
    }
}

export default new BaseController();