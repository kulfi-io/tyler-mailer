import { BaseController } from './base-controller';
import { Request, Response } from "express";
import Result from '../models/result';
import Note from '../models/note';

export class NoteController extends BaseController {
    private note?: Note 
    constructor() {
        super();
    }

    send = (req: Request, res: Response) => {
        if (
            !req.body.sender ||
            !req.body.firstname ||
            !req.body.lastname ||
            !req.body.content
        ) {
            return res.status(400).send({ message: "missing data item(s)" });
        }

        this.note = new Note(
            req.body.sender
            , req.body.firstname
            , req.body.lastname
            , req.body.content
        );
        

        this.Email.send({
            template: 'note',
            message: {
                from: 'ashish@ashishc.io',
                to: 'ashish@ashishc.io; kulfiapp@gmail.com'
            },
            locals: {
                fullname: this.note.fullname(),
                content: this.note.content,
                created: new Date().toDateString(),
            }
        })
        .then((result: Result) => {
            res.status(200).send({ message: 'sent' });
        })
        .catch((err: Error) => {
            res.status(400).send({ message: err.message });
        });

    }
    
}

export default new NoteController();

