import login from '../controllers/login-controller';
import note from '../controllers/note-controller';
import user from '../controllers/user-controller';
import { BaseRoute } from './base-router';
import { Router } from 'express';

export class MailerRouter extends BaseRoute {
   
    constructor() {
        super();
    }

    public map(router: Router) {
        router.get('/', this.responseData);
        router.post('/v1/register', user.registerAccount);
        router.post('/v1/note',  note.sendNote);
        router.post('/v1/reset-request', login.resetRequest)
    }
}

export default new MailerRouter();

