const expect = require('chai').expect;
const LambdaTester = require('lambda-tester');
const sendSms = require('..');
const proxyquire = require('proxyquire').noCallThru();

const sinon = require('sinon');

describe('handler', function () {

    let lambda;

    let AWSStub;

    let snsStub;

    let mapperStub;

    beforeEach(function () {

        mapperStub = {
            DataMapper: sinon.stub().returns({put: sinon.stub()})
        };

        snsStub = {
            publish: sinon.stub().withArgs({
                Message: '1-2-3',
                PhoneNumber: '918884640004'
            }).returns({
                promise: () => { return {MessageId: 'e6fe8c0b-55e7-5ddc-863b-dc46435b33ec'}
                }
            }),
            setSMSAttributes: sinon.stub().withArgs({
                attributes: { /* required */
                    'DefaultSMSType': 'Transactional'
                }
            }).returns({
                promise: () => {
                }
            })
        };

        AWSStub = {
            SNS: sinon.stub().returns(snsStub),
            DynamoDB: sinon.stub().returns()
        };

        lambda = proxyquire('../src/handler', {
            'aws-sdk': AWSStub,
            '@aws/dynamodb-data-mapper': mapperStub
        });
    });

    describe('.handler', function () {

        it('send message', async function () {

            snsStub.setSMSAttributes.return;
            snsStub.publish.return;

            await LambdaTester(lambda.send)
                .event({
                    body: {
                        message: '1-2-3',
                        phoneNumber: '918884640004'
                    }
                })
                .expectResult((result) => {

                    expect(result).to.eql({
                        messageId: 'e6fe8c0b-55e7-5ddc-863b-dc46435b33ec',
                        result: 'Success',
                        statusCode: 200
                    });

                    expect(snsStub.publish.calledOnce).to.be.true;
                });
        });

        it( 'fail to send message', function() {

            snsStub.setSMSAttributes.return;

            return LambdaTester( lambda.send )
                .event( {
                    body: {
                        message: '1-2-3',
                        phoneNumber: ''
                    }
                })
                .expectResult( ( result ) => {
                    expect(result).to.eql({
                        result: 'Bad Request',
                        statusCode: 400
                    });
                    expect( snsStub.publish.calledOnce ).to.be.false;
                });
        });
    });
});