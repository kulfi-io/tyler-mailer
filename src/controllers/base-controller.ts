import * as mailer from 'nodemailer';
import * as config from '../config/config.json';
import * as crypto from 'crypto'
import * as aws from 'aws-sdk';
import { IMail } from '../models/interfaces';
import * as Email from 'email-templates';
import { MailerDB } from '../controllers/mailer-db-controller';
import Verify from '../models/verify';
import { ENV } from '../db/db-enums';
import { Types } from 'mongoose';

const Mail = require('mail');

export class BaseController {
    protected transporter: typeof Mail;
    protected mail: IMail;
    protected transportSecret: string;
    protected Email: Email;
    protected isProd: boolean;
    private hashType: string;
    private algorithm: string;
    private hash: crypto.Hmac;
    private key: Buffer;
    private iv: Buffer;

    constructor() {
        this.mail = config.mail;
        this.transportSecret = config.transportSecret;
        this.isProd = process.env.NODE_ENV === ENV.PROD;

        this.hashType = 'sha512';
        this.algorithm = 'aes-256-gcm';

        this.hash = crypto.createHmac(this.hashType, config.secret);
        this.key = this.hash.digest().slice(0, 32);
        this.iv = Buffer.alloc(16, 0);

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

    protected encryptIV = (data: string): string => {
        const _cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let _encrypted = _cipher.update(data, 'utf8', 'hex');
        let _final = _cipher.final('hex');

        return this.isProd ? _encrypted : data;
    }

    protected decryptIV = (data: string): string => {
        const _decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let _decrypted = _decipher.update(data, 'hex', 'utf8');

        return this.isProd ? _decrypted : data;
    }



    // protected encryptData(data: string): string {
    //     var _data = crypto.AES.encrypt(data, this.transportSecret);
    //     return this.isProd ? _data.toString() : data;
    // }

    // protected decryptData(data: string): string {
        
    //     if(this.isProd) {
    //         var _data = crypto.AES.decrypt(data, this.transportSecret);
    //         var _plaintext = _data.toString(crypto.enc.Utf8);
    //         return _plaintext;
    //     }

    //     return data;
    // }

    protected mongoIdObject(data: string) {
        var _id = Types.ObjectId(data);
        return _id;
    }
}

export default new BaseController();