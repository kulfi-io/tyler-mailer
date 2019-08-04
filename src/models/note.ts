import { INote } from "./interfaces";

export default class Note implements INote {

    email: string;    
    firstname: string;
    lastname: string;
    content: string;

    constructor() {
        this.email = '';
        this.firstname = '';
        this.lastname = '';
        this.content = '';
    }

    fullname(): string {
        return `${this.firstname} ${this.lastname}`;
    }

}

