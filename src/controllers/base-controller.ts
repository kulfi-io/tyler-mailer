import * as mailer from 'nodemailer';
import * as config from '../config/config.json';
import * as crypto from 'crypto-js';
import * as aws from 'aws-sdk';
import { IMail } from 'src/models/interfaces.js';
const Mail = require('mail');

export class BaseController {
    protected transporter: typeof Mail;
    protected mail: IMail;
    protected transportSecret: string;
    
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