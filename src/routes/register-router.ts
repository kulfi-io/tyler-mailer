import { BaseRoute } from './base-router';
import { Router} from 'express';
import register from '../controllers/register-controller';

export class RegisterRouter extends BaseRoute {
   
    constructor() {
        super();
    }

    public static map(router: Router) {
        router.post('/v1/register', register.send);
    }
}

export default new RegisterRouter();