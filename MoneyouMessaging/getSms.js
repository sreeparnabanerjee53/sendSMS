'use strict';
let {DataMapper} = require('@aws/dynamodb-data-mapper');
let AWS = require('aws-sdk');
const client = new AWS.DynamoDB({region: 'ap-southeast-1'});
const mapper = new DataMapper({client});
let MessageTable = require('./MessageTable');

exports.getSms = async (event) => {
    let response = {
        statusCode: 500,
    };
    try {
        let fetchedMessages = [];
        for await (const message of mapper.query(MessageTable, {phoneNumber: event.path.phonenumber})) {
            fetchedMessages.push(message);
        }
        response.statusCode = 200;
        response.result = fetchedMessages;

    } catch (e) {
        response.result = e.errorMessage;
        const err = new Error(e.stack);
        throw err;
    }
    return response;
};