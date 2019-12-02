const {
    DynamoDbSchema,
    DynamoDbTable
} = require('@aws/dynamodb-data-mapper');

class MessageTable {
    // Declare methods and properties as usual
    constructor() {
    };
}

Object.defineProperties(MessageTable.prototype, {
    [DynamoDbTable]: {
        value: 'messagesTable'
    },
    [DynamoDbSchema]: {
        value: {
            phoneNumber: {
                type: 'String',
                keyType: 'HASH'
            },
            updatedAt: {
                type: 'String',
                keyType: 'RANGE'
            },
            messageId: {type: 'String'},
            message: {type: 'String'}
        },
    },
});
module.exports = MessageTable;