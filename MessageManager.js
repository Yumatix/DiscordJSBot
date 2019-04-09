

module.exports = class MessageManager {
    constructor(messageDeleteTimeout, deleteCommandMessages = true, deleteResponseMessages = true){
        this.commandMessages = [];
        this.responseMessages = [];
        this.deleteCommandMessages = deleteCommandMessages;
        this.deleteResponseMessages = deleteResponseMessages;
        this.messageDeleteTimeout = messageDeleteTimeout;
    }

    addCommandMessage(message){
        if (this.deleteCommandMessages){
            message.delete(this.messageDeleteTimeout).catch();
        }
        this.commandMessages.push(message);
    }

    addResponseMessage(message){
        if (this.deleteResponseMessages){
            message.delete(this.messageDeleteTimeout).catch();
        }
        this.responseMessages.push(message);
    }
}