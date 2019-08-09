import Note from '../models/note';
import Result from '../models/result';
import { BaseController } from './base-controller';
import { Request, Response } from 'express';

export class NoteController extends BaseController {
    private note: Note 
    constructor() {
        super();
        this.note = new Note();
    }

    sendNote = (req: Request, res: Response) => {
        if (
            !req.body.email ||
            !req.body.firstname ||
            !req.body.lastname ||
            !req.body.content
        ) {
            return res.status(400).send({ message: "missing data item(s)" });
        }

        this.note.email = this.decrypt(req.body.email);
        this.note.firstname = this.decrypt(req.body.firstname);
        this.note.lastname = this.decrypt(req.body.lastname);
        this.note.content  = this.decrypt(req.body.content);
        
        this.Email.send({
            template: 'note',
            message: {
                from: this.mail.overrideEmail
                    ? this.mail.passiveTarget
                    : this.note.email,
                to: this.mail.overrideEmail
                    ? `${this.mail.sender}; ${this.mail.passiveTarget}`
                    : `${this.mail.sender}; ${this.note.email}`
            },
            locals: {
                fullname: this.note.fullname(),
                content: this.note.content,
                created: new Date().toDateString(),
            }
        })
        .then((result: Result) => {
            res.status(200).send({ message: `Note sent` });
        })
        .catch((err: Error) => {
            res.status(400).send({ message: err.message });
        });

    }
    
}

export default new NoteController();

