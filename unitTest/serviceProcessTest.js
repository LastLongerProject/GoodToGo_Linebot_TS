const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const should = chai.should();
const promise = require('../app/api/customPromise')


beforeEach(function(done) {
    mongoose.connect("mongodb://GoodToGo:benjamin@app.goodtogo.tw/runtime", { useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
        console.log('We are connected to database!');
        done();
    });
});

describe("test linbot server's controller", function() {
    describe("getRecord testing", function() {
        it("should give me user's record", async function() {
            var event = {
                source: {
                    userId: 'U82fbd0be20051fb3ad8d85d0974352fc'
                }
            }
            const res = getRecord(event);
            res.should.equal('success');
        });
    });
});