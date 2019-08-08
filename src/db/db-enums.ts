export enum CONN {
    FAILURE = "Connection failure",
    CONNECTED = "Connected to db",
    ERROR = "Connection error",
    DISCONNECTED = "Connection disconnected",
    RECONNECTED = "Connection reconnected",
    CLOSED = "Connection closed",
}

export enum ENV {
    DEV = "development",
    PROD = "production"
}

export enum MAILER {
    MISSING_REQUIRED_ITEMS = "Missing required items",
    REQUEST_SENT = "Request sent"
}
