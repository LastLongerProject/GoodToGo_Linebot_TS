const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
const expect = chai.expect;
const request = require('request');

describe('is register api useful', function() {

    const requestObject = {
        uri: 'https://app.goodtogo.tw/test/users/signup',
        method: 'POST',
        json: true,
        headers: {
            'User-Agent': 'goodtogo_linebot',
            'reqID': 'ABCDEF0123',
            'reqTime': Date.now()
        },
        body: {
            phone: '0918283848',
            password: "",
        }
    };

    it('should return 205', function(done) {
        request(requestObject, (err, res, body) => {
            console.log(res.body);
            expect(res.statusCode).to.equal(205);
            done();
        });
    });

});