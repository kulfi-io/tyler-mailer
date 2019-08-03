import { INote } from "./interfaces";

export default class Note implements INote {

    email: string;    
    firstname: string;
    lastname: string;
    content: string;

    constructor(email: string, firstname: string, lastname: string, content: string) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.content = content;
    }

    fullname(): string {
        return `${this.firstname} ${this.lastname}`;
    }

}

