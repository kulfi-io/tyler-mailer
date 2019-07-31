import { INote } from "./interfaces";

export default class Note implements INote {

    sender: string;    
    firstname: string;
    lastname: string;
    content: string;

    constructor(sender: string, firstname: string, lastname: string, content: string) {
        this.sender = sender;
        this.firstname = firstname;
        this.lastname = lastname;
        this.content = content;
    }

    fullname(): string {
        return `${this.firstname} ${this.lastname}`;
    }

}

