import * as aws from 'aws-sdk';
import * as config from '../config/config.json';
import * as crypto from 'crypto';
import * as Email from 'email-templates';
import * as mailer from 'nodemailer';
import Verify from '../models/verify';
import { ENV } from '../db/db-enums';
import { IMail, IcryptoData } from '../models/interfaces';
import { MailerDB } from '../controllers/mailer-db-controller';
import { Types } from 'mongoose';
import * as path from 'path';

const Mail = require('mail');

export class BaseController {
    protected transporter: typeof Mail;
    protected mail: IMail;
    protected Email: Email;
    protected isProd: boolean;
    private algorithm: string;
    private algorithmIv: string;
    private key: Buffer;
    private iv: Buffer | undefined;

    constructor() {
        this.mail = config.mail;
        this.isProd = process.env.NODE_ENV === ENV.PROD;

        this.algorithm = 'aes192';
        this.algorithmIv = 'aes-256-cbc';

        const _key = Buffer.alloc(32);

        this.key = Buffer.concat([Buffer.from(config.secret)], _key.length)

        const _options = {
            "accessKeyId": this.mail.user,
            "secretAccessKey": this.mail.pass,
            "region": this.mail.region,
        }

        this.transporter = mailer.createTransport({
            SES: new aws.SES(_options)
        });

        const root = this.isProd ? path.join(config.prodBaseRoot) : path.join(config.devBaseRoot);

        this.Email = new Email({
            message: {
                from: this.mail.sender
            },
            preview: this.mail.preview,
            transport: this.transporter,
            send: this.mail.send,
            views: {root},           
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

    protected encryptIv = (data: string): IcryptoData | string => {
        if(this.isProd) {
            this.iv = crypto.randomBytes(16);

            let cipher = crypto.createCipheriv(this.algorithmIv.toString(), this.key, this.iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return {
                iv: this.iv.toString('hex'), 
                encryptedData: encrypted
            };
    
        }

        return data;
    }

    protected decrypt = (data: string): string => {
        const decipher = crypto.createDecipher(this.algorithm, config.secret);

        let decrypted;
        if(this.isProd) {
            decrypted = decipher.update(data, 'hex', 'utf8');
            decrypted += decipher.final('utf-8');

            return  decrypted; 
        }

        return data;
        
    }

    protected decryptIv = (data: string): string => {
        if(this.isProd) {

            const _stringifiedData = JSON.stringify(data);
            const _data: IcryptoData = <IcryptoData>JSON.parse(_stringifiedData);
            let iv = Buffer.from(_data.iv, 'hex');
            

            let decipher = crypto.createDecipheriv(this.algorithmIv, this.key, iv);

            let decrypted = decipher.update(_data.encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8'); 

            return decrypted;
    
        } 

        return data;
    }

    protected mongoIdObject(data: string) {
        var _id = Types.ObjectId(data);
        return _id;
    }
}

export default new BaseController();