export default class MailerResult {
    accept?: string[];
    rejected?: string[];
    envelopTime?: number;
    messageTime?: number;
    response?: string;
    envelop?: { "from": string; "to": string[] };
    messageId?: string;
    originalMessage?: string;
}