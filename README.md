# sendSMS
### Prerequisite:
    Requires Node 8 or higher

### Deploy to AWS:
    npm run deploy
    This will use serverless to deploy the API as described in serverless.yml.

### Run test:
    npm test

- - - - 
# How it Works
- - - -
### Overview
This repo uses Serverless Framework to describe, test and deploy the REST API to AWS Lambda. AWS Lambda provides "serverless" cloud functions as a service. AWS API Gateway is used to expose the deployed Lambda functions as a HTTP REST API.
SNS SMS sending capability is used to send SMS. DynamoDB is used for persistence.
APIs are secured using API Key only.
Request header:
Content-Type : application/json
x-api-key : 'Your API-KEY shared with you or generated after deploy'
Request body is validated on , the api throws Bad Request if not in the below format: 
```
{
	"message" : "message sent for testing",
	"phoneNumber" : "Recipient's Phone Number(Ex: 918884640004)"
}
```

### APIs
- - - -
The APIs are described in the serverless.yml file. For example the following snippet instructs AWS Lambda to execute the send method in src/handler.js whenever a POST method is called on /test/message:

```yaml
functions:
  SendSMS:
    handler: handler.send
    #    The following are a few example events you can configure
    #    NOTE: Please make sure to change your handler code to work with those events
    #    Check the event documentation for details
    events:
      - http:
          path: message
          method: post
          integration: lambda
```
the following snippet instructs AWS Lambda to execute the getSms method in src/getSms.js whenever a GET method is called on /test/message/{phonenumber}:

```yaml
GetSMS:
    handler: getSms.getSms
    events:
      - http:
          path: message/{phonenumber}
          method: get
          integration: lambda
```
### Storage
- - - -
For storage, AWS DynamoDB a managed serverless NoSQL database is used. Tables are created to store phoneNumber, message and messageId also described in serverless.yml file. For example:
```yaml
resources:
  Resources:
    messagesTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: messagesTable
        AttributeDefinitions:
          - AttributeName: phoneNumber
            AttributeType: S
          - AttributeName: updatedAt
            AttributeType: S
        KeySchema:
          - AttributeName: phoneNumber
            KeyType: HASH
          - AttributeName: updatedAt
            KeyType: RANGE
        ProvisionedThroughput:
            ReadCapacityUnits: 5
            WriteCapacityUnits: 5
```

