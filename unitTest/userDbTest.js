/*jslint node: true */
/*jslint es6 */
/*global describe, it, before, beforeEach, after, afterEach */

"use strict";

const mongoose = require('mongoose');
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const request = require('request');

chai.use(chaiAsPromised).should();

const User = require('../app/models/db/userDB');

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

describe('#User', function() {
    before(function(done) {
        User.deleteOne({ 'user.phone': "0911111111" });
        done();
    });

    describe('#save()', function() {
        it('should save without error', async function() {
            var user = new User({
                user: {
                    phone: "0911111111",
                    lineId: "19293"
                }
            });
            const res = await user.save();
            res.user.phone.should.equal('0911111111');
        });
    });

    describe('#find()', function() {
        it('should find user.phone 0911111111', async function() {
            const res = await User.findOne({ 'user.phone': '0911111111' });
            res.user.phone.should.equal('0911111111');
        });
    });
});