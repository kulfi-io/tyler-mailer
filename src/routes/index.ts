import { BaseRoute } from './base-router';
import { Router} from 'express';
import register from '../controllers/register-controller';
import note from '../controllers/note-controller';

export class MailerRouter extends BaseRoute {
   
    constructor() {
        super();
    }

    public map(router: Router) {
        router.post('/v1/register', register.send);
        router.post('/v1/note',  note.send);
    }
}

export default new MailerRouter();