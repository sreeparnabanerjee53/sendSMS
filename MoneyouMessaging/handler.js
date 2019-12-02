'use strict';
let messageSchema = require('./MessageSchema').messageSchema;
let Validator = require('jsonschema').Validator;
let v = new Validator();
let {DataMapper} = require('@aws/dynamodb-data-mapper');
let AWS = require('aws-sdk');
let sns = new AWS.SNS();
const client = new AWS.DynamoDB({region: 'ap-southeast-1'});
const mapper = new DataMapper({client});
let MessageTable = require('./MessageTable');

exports.send = async (event) => {

    let response = {
        statusCode: 500,
    };
    try {
        let body = event.body;
        let validationResult = await v.validate(body, messageSchema);
        console.log(validationResult);
        if (validationResult.errors.length > 0) {
            response.statusCode = 400;
            response.result = 'Bad Request';
            return response;
        }
        await sns.setSMSAttributes({
            attributes: { /* required */
                'DefaultSMSType': 'Transactional'
            }
        }).promise();
        const data = await sns.publish({
            Message: body.message,
            PhoneNumber: body.phoneNumber
        }).promise();
        let messageTable = new MessageTable();
        messageTable.phoneNumber = body.phoneNumber;
        messageTable.updatedAt = new Date().getTime();
        messageTable.messageId = data.MessageId;
        messageTable.message = body.message;

        await mapper.put({item: messageTable});
        response.messageId = data.MessageId;
        response.result = 'Success';
        response.statusCode = 200;
    } catch (e) {
        throw e;
    }
    return response;
};