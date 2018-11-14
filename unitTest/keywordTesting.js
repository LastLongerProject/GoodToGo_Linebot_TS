/*jslint node: true */
/*jslint es6 */
/*global describe, it, before, beforeEach, after, afterEach */

"use strict";

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const User = require('../app/models/db/userDB');

describe('#User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User({
                user: {
                    phone: "0911111111",
                    lineId: "19293",
                    recordIndex: "123123"
                }
            });
            user.save(done);
        });
    });
});